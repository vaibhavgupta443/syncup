package com.ac1.app.service;

import com.ac1.app.dto.ParticipantResponse;
import com.ac1.app.exception.BadRequestException;
import com.ac1.app.exception.ResourceNotFoundException;
import com.ac1.app.model.*;
import com.ac1.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing activity participation (join requests, approvals,
 * rejections).
 */
@Service
public class ParticipationService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityParticipantRepository participantRepository;

    @Autowired
    private AuthService authService;

    /**
     * Request to join an activity.
     */
    @Transactional
    public ParticipantResponse requestToJoin(Long activityId) {
        User currentUser = authService.getCurrentUser();
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        // Validation checks
        if (activity.isDeleted()) {
            throw new BadRequestException("This activity is no longer available");
        }

        if (activity.getStatus() != ActivityStatus.OPEN) {
            throw new BadRequestException("This activity is not open for joining");
        }

        if (activity.getCreator().getId().equals(currentUser.getId())) {
            throw new BadRequestException("You are already the creator of this activity");
        }

        if (participantRepository.existsByActivityIdAndUserId(activityId, currentUser.getId())) {
            throw new BadRequestException("You have already requested to join this activity");
        }

        // Age check
        if (currentUser.getAge() != null) {
            if (activity.getMinAge() != null && currentUser.getAge() < activity.getMinAge()) {
                throw new BadRequestException("You do not meet the minimum age requirement");
            }
            if (activity.getMaxAge() != null && currentUser.getAge() > activity.getMaxAge()) {
                throw new BadRequestException("You exceed the maximum age limit");
            }
        }

        // Check capacity
        if (activity.getMaxParticipants() != null &&
                activity.getCurrentParticipants() >= activity.getMaxParticipants()) {
            throw new BadRequestException("This activity has reached maximum capacity");
        }

        ActivityParticipant participant = ActivityParticipant.builder()
                .activity(activity)
                .user(currentUser)
                .status(ParticipationStatus.PENDING)
                .build();

        participant = participantRepository.save(participant);

        return mapToParticipantResponse(participant);
    }

    /**
     * Get pending requests for an activity (only for creator).
     */
    public List<ParticipantResponse> getPendingRequests(Long activityId) {
        User currentUser = authService.getCurrentUser();
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        if (!activity.getCreator().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Only the creator can view pending requests");
        }

        return participantRepository.findByActivityIdAndStatus(activityId, ParticipationStatus.PENDING)
                .stream()
                .map(this::mapToParticipantResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get approved participants for an activity.
     */
    public List<ParticipantResponse> getApprovedParticipants(Long activityId) {
        return participantRepository.findByActivityIdAndStatus(activityId, ParticipationStatus.APPROVED)
                .stream()
                .map(this::mapToParticipantResponse)
                .collect(Collectors.toList());
    }

    /**
     * Approve a join request.
     */
    @Transactional
    public ParticipantResponse approveRequest(Long participantId) {
        User currentUser = authService.getCurrentUser();
        ActivityParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant", "id", participantId));

        Activity activity = participant.getActivity();

        if (!activity.getCreator().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Only the creator can approve requests");
        }

        if (participant.getStatus() != ParticipationStatus.PENDING) {
            throw new BadRequestException("This request has already been processed");
        }

        // Check capacity before approving
        if (activity.getMaxParticipants() != null &&
                activity.getCurrentParticipants() >= activity.getMaxParticipants()) {
            throw new BadRequestException("Activity has reached maximum capacity");
        }

        participant.setStatus(ParticipationStatus.APPROVED);
        participant.setRespondedAt(LocalDateTime.now());
        participant = participantRepository.save(participant);

        // Update participant count
        activity.setCurrentParticipants(activity.getCurrentParticipants() + 1);
        if (activity.getMaxParticipants() != null &&
                activity.getCurrentParticipants() >= activity.getMaxParticipants()) {
            activity.setStatus(ActivityStatus.FULL);
        }
        activityRepository.save(activity);

        return mapToParticipantResponse(participant);
    }

    /**
     * Reject a join request.
     */
    @Transactional
    public ParticipantResponse rejectRequest(Long participantId) {
        User currentUser = authService.getCurrentUser();
        ActivityParticipant participant = participantRepository.findById(participantId)
                .orElseThrow(() -> new ResourceNotFoundException("Participant", "id", participantId));

        Activity activity = participant.getActivity();

        if (!activity.getCreator().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Only the creator can reject requests");
        }

        if (participant.getStatus() != ParticipationStatus.PENDING) {
            throw new BadRequestException("This request has already been processed");
        }

        participant.setStatus(ParticipationStatus.REJECTED);
        participant.setRespondedAt(LocalDateTime.now());
        participant = participantRepository.save(participant);

        return mapToParticipantResponse(participant);
    }

    /**
     * Get user's participation status in an activity.
     */
    public ParticipantResponse getMyParticipation(Long activityId) {
        User currentUser = authService.getCurrentUser();
        return participantRepository.findByActivityIdAndUserId(activityId, currentUser.getId())
                .map(this::mapToParticipantResponse)
                .orElse(null);
    }

    /**
     * Check if user is approved participant.
     */
    public boolean isApprovedParticipant(Long activityId, Long userId) {
        return participantRepository.findByActivityIdAndUserId(activityId, userId)
                .map(p -> p.getStatus() == ParticipationStatus.APPROVED)
                .orElse(false);
    }

    /**
     * Map to response DTO.
     */
    private ParticipantResponse mapToParticipantResponse(ActivityParticipant participant) {
        User user = participant.getUser();
        Double rating = user.getProfile() != null ? user.getProfile().getAverageRating() : 0.0;

        return ParticipantResponse.builder()
                .id(participant.getId())
                .activityId(participant.getActivity().getId())
                .userId(user.getId())
                .userName(user.getFullName())
                .userPhotoUrl(user.getProfilePhotoUrl())
                .userRating(rating)
                .status(participant.getStatus())
                .requestedAt(participant.getRequestedAt())
                .build();
    }
}
