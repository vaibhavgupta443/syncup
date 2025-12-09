package com.ac1.app.service;

import com.ac1.app.dto.ActivityResponse;
import com.ac1.app.model.*;
import com.ac1.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for generating personalized activity recommendations.
 */
@Service
public class RecommendationService {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ActivityParticipantRepository participantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private ActivityService activityService;

    /**
     * Get personalized activity recommendations for current user.
     */
    public List<ActivityResponse> getRecommendations(int limit) {
        User currentUser = authService.getCurrentUser();

        // Get user's interests from profile
        Set<String> userInterests = new HashSet<>();
        if (currentUser.getProfile() != null && currentUser.getProfile().getInterests() != null) {
            userInterests.addAll(Arrays.asList(currentUser.getProfile().getInterests().split(",")));
        }

        // Get categories from user's past activities
        List<ActivityParticipant> pastParticipations = participantRepository
                .findByUserIdAndStatus(currentUser.getId(), ParticipationStatus.APPROVED);

        Set<String> participatedCategories = pastParticipations.stream()
                .map(p -> p.getActivity().getCategory())
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Combine interests with participated categories
        Set<String> preferredCategories = new HashSet<>();
        preferredCategories.addAll(userInterests);
        preferredCategories.addAll(participatedCategories);

        // Get activities in preferred categories
        List<Activity> recommendedActivities;
        if (!preferredCategories.isEmpty()) {
            recommendedActivities = activityRepository.findByCategoryInAndStatusAndDeletedFalse(
                    new ArrayList<>(preferredCategories), ActivityStatus.OPEN);
        } else {
            // Fallback to all open activities
            recommendedActivities = activityRepository
                    .findByStatusAndDeletedFalse(ActivityStatus.OPEN,
                            org.springframework.data.domain.PageRequest.of(0, limit * 2))
                    .getContent();
        }

        // Filter out activities user already joined or created
        Set<Long> userActivityIds = pastParticipations.stream()
                .map(p -> p.getActivity().getId())
                .collect(Collectors.toSet());

        recommendedActivities = recommendedActivities.stream()
                .filter(a -> !a.getCreator().getId().equals(currentUser.getId()))
                .filter(a -> !userActivityIds.contains(a.getId()))
                .collect(Collectors.toList());

        // Score and sort by relevance
        List<ScoredActivity> scoredActivities = recommendedActivities.stream()
                .map(a -> new ScoredActivity(a, calculateScore(a, currentUser, preferredCategories)))
                .sorted((a, b) -> Double.compare(b.score, a.score))
                .limit(limit)
                .collect(Collectors.toList());

        return scoredActivities.stream()
                .map(sa -> mapToActivityResponse(sa.activity))
                .collect(Collectors.toList());
    }

    /**
     * Calculate relevance score for an activity.
     */
    private double calculateScore(Activity activity, User user, Set<String> preferredCategories) {
        double score = 0;

        // Category match
        if (preferredCategories.contains(activity.getCategory())) {
            score += 30;
        }

        // Skill level match
        if (user.getProfile() != null &&
                user.getProfile().getSkillLevel() == activity.getRequiredSkillLevel()) {
            score += 20;
        }

        // Location proximity (simplified - just check if location contains user's
        // location)
        if (user.getProfile() != null && user.getProfile().getLocation() != null &&
                activity.getLocation() != null &&
                activity.getLocation().toLowerCase().contains(
                        user.getProfile().getLocation().toLowerCase())) {
            score += 25;
        }

        // Creator rating bonus
        if (activity.getCreator().getProfile() != null) {
            score += activity.getCreator().getProfile().getAverageRating() * 5;
        }

        // Age appropriateness
        if (user.getAge() != null) {
            boolean ageAppropriate = true;
            if (activity.getMinAge() != null && user.getAge() < activity.getMinAge()) {
                ageAppropriate = false;
            }
            if (activity.getMaxAge() != null && user.getAge() > activity.getMaxAge()) {
                ageAppropriate = false;
            }
            if (ageAppropriate) {
                score += 10;
            }
        }

        // Availability bonus (activities happening soon)
        if (activity.getDateTime() != null) {
            long daysUntil = java.time.temporal.ChronoUnit.DAYS.between(
                    java.time.LocalDateTime.now(), activity.getDateTime());
            if (daysUntil <= 7) {
                score += 15;
            } else if (daysUntil <= 14) {
                score += 10;
            }
        }

        return score;
    }

    /**
     * Helper class for scored activities.
     */
    private static class ScoredActivity {
        Activity activity;
        double score;

        ScoredActivity(Activity activity, double score) {
            this.activity = activity;
            this.score = score;
        }
    }

    /**
     * Map to response DTO.
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
