package com.ac1.app.service;

import com.ac1.app.dto.FeedbackRequest;
import com.ac1.app.dto.FeedbackResponse;
import com.ac1.app.exception.BadRequestException;
import com.ac1.app.exception.ResourceNotFoundException;
import com.ac1.app.model.*;
import com.ac1.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for feedback and rating system.
 */
@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ParticipationService participationService;

    @Autowired
    private ProfileService profileService;

    @Autowired
    private AuthService authService;

    /**
     * Submit feedback for a user after an activity.
     */
    @Transactional
    public FeedbackResponse submitFeedback(Long activityId, FeedbackRequest request) {
        User currentUser = authService.getCurrentUser();
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        // Check if activity is completed
        if (activity.getStatus() != ActivityStatus.COMPLETED) {
            throw new BadRequestException("Feedback can only be given after activity completion");
        }

        // Check if user was a participant
        if (!participationService.isApprovedParticipant(activityId, currentUser.getId())) {
            throw new BadRequestException("You must be a participant to give feedback");
        }

        // Check if reviewee was a participant
        if (!participationService.isApprovedParticipant(activityId, request.getRevieweeId())) {
            throw new BadRequestException("You can only review other participants");
        }

        // Cannot review yourself
        if (currentUser.getId().equals(request.getRevieweeId())) {
            throw new BadRequestException("You cannot review yourself");
        }

        // Check if already reviewed
        if (feedbackRepository.existsByActivityIdAndReviewerIdAndRevieweeId(
                activityId, currentUser.getId(), request.getRevieweeId())) {
            throw new BadRequestException("You have already reviewed this user for this activity");
        }

        User reviewee = userRepository.findById(request.getRevieweeId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", request.getRevieweeId()));

        Feedback feedback = Feedback.builder()
                .activity(activity)
                .reviewer(currentUser)
                .reviewee(reviewee)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();

        feedback = feedbackRepository.save(feedback);

        // Update reviewee's average rating
        profileService.updateUserRating(reviewee.getId());

        return mapToFeedbackResponse(feedback);
    }

    /**
     * Get feedback received by a user.
     */
    public List<FeedbackResponse> getFeedbackForUser(Long userId) {
        return feedbackRepository.findByRevieweeId(userId)
                .stream()
                .map(this::mapToFeedbackResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get feedback for an activity.
     */
    public List<FeedbackResponse> getFeedbackForActivity(Long activityId) {
        return feedbackRepository.findByActivityId(activityId)
                .stream()
                .map(this::mapToFeedbackResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get feedback given by current user.
     */
    public List<FeedbackResponse> getMyGivenFeedback() {
        User currentUser = authService.getCurrentUser();
        return feedbackRepository.findByReviewerId(currentUser.getId())
                .stream()
                .map(this::mapToFeedbackResponse)
                .collect(Collectors.toList());
    }

    /**
     * Map to response DTO.
     */
    private FeedbackResponse mapToFeedbackResponse(Feedback feedback) {
        return FeedbackResponse.builder()
                .id(feedback.getId())
                .activityId(feedback.getActivity().getId())
                .activityName(feedback.getActivity().getName())
                .reviewerId(feedback.getReviewer().getId())
                .reviewerName(feedback.getReviewer().getFullName())
                .revieweeId(feedback.getReviewee().getId())
                .revieweeName(feedback.getReviewee().getFullName())
                .rating(feedback.getRating())
                .comment(feedback.getComment())
                .createdAt(feedback.getCreatedAt())
                .build();
    }
}
