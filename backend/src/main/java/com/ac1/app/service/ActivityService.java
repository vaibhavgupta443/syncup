package com.ac1.app.service;

import com.ac1.app.dto.*;
import com.ac1.app.exception.BadRequestException;
import com.ac1.app.exception.ResourceNotFoundException;
import com.ac1.app.model.*;
import com.ac1.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for activity management.
 */
@Service
public class ActivityService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityParticipantRepository participantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private ProfileService profileService;

    // Predefined activity categories
    public static final List<String> PREDEFINED_CATEGORIES = Arrays.asList(
            "Playing Cricket",
            "Watching Movie",
            "Football",
            "Gym",
            "Study Group",
            "Coffee Meetups",
            "Basketball",
            "Tennis",
            "Hiking",
            "Board Games");

    /**
     * Get predefined activity categories.
     */
    public List<String> getPredefinedCategories() {
        return PREDEFINED_CATEGORIES;
    }

    /**
     * Create a new activity.
     */
    @Transactional
    public ActivityResponse createActivity(ActivityRequest request) {
        User currentUser = authService.getCurrentUser();

        Activity activity = Activity.builder()
                .name(request.getName())
                .category(request.getCategory())
                .description(request.getDescription())
                .location(request.getLocation())
                .dateTime(request.getDateTime())
                .requiredSkillLevel(request.getRequiredSkillLevel())
                .minAge(request.getMinAge())
                .maxAge(request.getMaxAge())
                .maxParticipants(request.getMaxParticipants())
                .currentParticipants(1) // Creator is auto-participant
                .entryFee(request.getEntryFee())
                .status(ActivityStatus.OPEN)
                .creator(currentUser)
                .imageUrls(request.getImageUrls() != null ? request.getImageUrls() : new HashSet<>())
                .deleted(false)
                .build();

        activity = activityRepository.save(activity);

        // Creator is auto-approved participant
        ActivityParticipant creatorParticipant = ActivityParticipant.builder()
                .activity(activity)
                .user(currentUser)
                .status(ParticipationStatus.APPROVED)
                .build();
        participantRepository.save(creatorParticipant);

        return mapToActivityResponse(activity);
    }

    /**
     * Get activity by ID.
     */
    public ActivityResponse getActivity(Long activityId) {
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        if (activity.isDeleted()) {
            throw new ResourceNotFoundException("Activity", "id", activityId);
        }

        return mapToActivityResponse(activity);
    }

    /**
     * Get all activities with pagination.
     */
    public Page<ActivityResponse> getAllActivities(Pageable pageable) {
        return activityRepository.findByDeletedFalse(pageable)
                .map(this::mapToActivityResponse);
    }

    /**
     * Get activities with filters.
     */
    public Page<ActivityResponse> getFilteredActivities(
            String category,
            SkillLevel skillLevel,
            String location,
            ActivityStatus status,
            Pageable pageable) {

        return activityRepository.findWithFilters(category, skillLevel, location, status, pageable)
                .map(this::mapToActivityResponse);
    }

    /**
     * Get activities created by current user.
     */
    public List<ActivityResponse> getMyCreatedActivities() {
        User currentUser = authService.getCurrentUser();
        return activityRepository.findByCreatorIdAndDeletedFalse(currentUser.getId())
                .stream()
                .map(this::mapToActivityResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get activities where current user is a participant.
     */
    public List<ActivityResponse> getMyJoinedActivities() {
        User currentUser = authService.getCurrentUser();
        return participantRepository.findByUserIdAndStatus(currentUser.getId(), ParticipationStatus.APPROVED)
                .stream()
                .filter(p -> !p.getActivity().isDeleted())
                .map(p -> mapToActivityResponse(p.getActivity()))
                .collect(Collectors.toList());
    }

    /**
     * Update an activity (only by creator).
     */
    @Transactional
    public ActivityResponse updateActivity(Long activityId, ActivityRequest request) {
        User currentUser = authService.getCurrentUser();
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        if (!activity.getCreator().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Only the creator can update this activity");
        }

        if (request.getName() != null)
            activity.setName(request.getName());
        if (request.getCategory() != null)
            activity.setCategory(request.getCategory());
        if (request.getDescription() != null)
            activity.setDescription(request.getDescription());
        if (request.getLocation() != null)
            activity.setLocation(request.getLocation());
        if (request.getDateTime() != null)
            activity.setDateTime(request.getDateTime());
        if (request.getRequiredSkillLevel() != null)
            activity.setRequiredSkillLevel(request.getRequiredSkillLevel());
        if (request.getMinAge() != null)
            activity.setMinAge(request.getMinAge());
        if (request.getMaxAge() != null)
            activity.setMaxAge(request.getMaxAge());
        if (request.getMaxParticipants() != null)
            activity.setMaxParticipants(request.getMaxParticipants());
        if (request.getEntryFee() != null)
            activity.setEntryFee(request.getEntryFee());
        if (request.getImageUrls() != null)
            activity.setImageUrls(request.getImageUrls());

        activity = activityRepository.save(activity);
        return mapToActivityResponse(activity);
    }

    /**
     * Mark activity as completed.
     */
    @Transactional
    public ActivityResponse completeActivity(Long activityId) {
        User currentUser = authService.getCurrentUser();
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        if (!activity.getCreator().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Only the creator can complete this activity");
        }

        activity.setStatus(ActivityStatus.COMPLETED);
        activity = activityRepository.save(activity);

        // Increment activity count for all approved participants
        participantRepository.findByActivityIdAndStatus(activityId, ParticipationStatus.APPROVED)
                .forEach(p -> profileService.incrementActivityCount(p.getUser().getId()));

        return mapToActivityResponse(activity);
    }

    /**
     * Delete an activity (soft delete).
     */
    @Transactional
    public void deleteActivity(Long activityId) {
        User currentUser = authService.getCurrentUser();
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        if (!activity.getCreator().getId().equals(currentUser.getId())) {
            throw new BadRequestException("Only the creator can delete this activity");
        }

        activity.setDeleted(true);
        activityRepository.save(activity);
    }

    /**
     * Map Activity entity to ActivityResponse DTO.
     */
    private ActivityResponse mapToActivityResponse(Activity activity) {
        User creator = activity.getCreator();
        Double creatorRating = 0.0;
        if (creator.getProfile() != null) {
            creatorRating = creator.getProfile().getAverageRating();
        }

        return ActivityResponse.builder()
                .id(activity.getId())
                .name(activity.getName())
                .category(activity.getCategory())
                .description(activity.getDescription())
                .location(activity.getLocation())
                .dateTime(activity.getDateTime())
                .requiredSkillLevel(activity.getRequiredSkillLevel())
                .minAge(activity.getMinAge())
                .maxAge(activity.getMaxAge())
                .maxParticipants(activity.getMaxParticipants())
                .currentParticipants(activity.getCurrentParticipants())
                .entryFee(activity.getEntryFee())
                .status(activity.getStatus())
                .imageUrls(activity.getImageUrls())
                .createdAt(activity.getCreatedAt())
                .creatorId(creator.getId())
                .creatorName(creator.getFullName())
                .creatorPhotoUrl(creator.getProfilePhotoUrl())
                .creatorRating(creatorRating)
                .build();
    }
}
