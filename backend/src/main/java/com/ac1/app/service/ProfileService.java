package com.ac1.app.service;

import com.ac1.app.dto.*;
import com.ac1.app.exception.ResourceNotFoundException;
import com.ac1.app.model.*;
import com.ac1.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashSet;

/**
 * Service for user profile operations.
 */
@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private AuthService authService;

    /**
     * Get user profile by user ID.
     */
    public ProfileResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserProfile profile = user.getProfile();

        ProfileResponse.ProfileResponseBuilder builder = ProfileResponse.builder()
                .userId(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .age(user.getAge())
                .profilePhotoUrl(user.getProfilePhotoUrl());

        if (profile != null) {
            builder.bio(profile.getBio())
                    .location(profile.getLocation())
                    .skillLevel(profile.getSkillLevel())
                    .interests(profile.getInterests())
                    .averageRating(profile.getAverageRating())
                    .totalActivities(profile.getTotalActivities())
                    .photoUrls(profile.getPhotoUrls())
                    .experienceTag(profile.getTotalActivities() >= 5 ? "Experienced" : "Newbie");
        } else {
            builder.averageRating(0.0)
                    .totalActivities(0)
                    .experienceTag("Newbie")
                    .photoUrls(new HashSet<>());
        }

        return builder.build();
    }

    /**
     * Get current user's profile.
     */
    public ProfileResponse getMyProfile() {
        User currentUser = authService.getCurrentUser();
        return getProfile(currentUser.getId());
    }

    /**
     * Create or update user profile.
     */
    @Transactional
    public ProfileResponse createOrUpdateProfile(ProfileRequest request) {
        User currentUser = authService.getCurrentUser();

        UserProfile profile = currentUser.getProfile();
        if (profile == null) {
            profile = new UserProfile();
            profile.setUser(currentUser);
            profile.setAverageRating(0.0);
            profile.setTotalActivities(0);
            profile.setPhotoUrls(new HashSet<>());
        }

        if (request.getBio() != null) {
            profile.setBio(request.getBio());
        }
        if (request.getLocation() != null) {
            profile.setLocation(request.getLocation());
        }
        if (request.getSkillLevel() != null) {
            profile.setSkillLevel(request.getSkillLevel());
        }
        if (request.getInterests() != null) {
            profile.setInterests(request.getInterests());
        }
        if (request.getPhotoUrls() != null) {
            profile.setPhotoUrls(request.getPhotoUrls());
        }

        userProfileRepository.save(profile);
        currentUser.setProfile(profile);
        userRepository.save(currentUser);

        return getProfile(currentUser.getId());
    }

    /**
     * Update user rating (called after receiving feedback).
     */
    @Transactional
    public void updateUserRating(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Double averageRating = feedbackRepository.getAverageRatingForUser(userId);
        if (averageRating == null) {
            averageRating = 0.0;
        }

        UserProfile profile = user.getProfile();
        if (profile != null) {
            profile.setAverageRating(averageRating);
            userProfileRepository.save(profile);
        }
    }

    /**
     * Increment activity count for a user.
     */
    @Transactional
    public void incrementActivityCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        UserProfile profile = user.getProfile();
        if (profile != null) {
            profile.setTotalActivities(profile.getTotalActivities() + 1);
            userProfileRepository.save(profile);
        }
    }
}
