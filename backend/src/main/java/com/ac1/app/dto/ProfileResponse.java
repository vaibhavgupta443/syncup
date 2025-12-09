package com.ac1.app.dto;

import com.ac1.app.model.SkillLevel;
import lombok.Builder;
import lombok.Data;
import java.util.Set;

/**
 * DTO for user profile response.
 */
@Data
@Builder
public class ProfileResponse {

    private Long userId;
    private String fullName;
    private String email;
    private Integer age;
    private String profilePhotoUrl;
    private String bio;
    private String location;
    private SkillLevel skillLevel;
    private String interests;
    private Double averageRating;
    private Integer totalActivities;
    private Set<String> photoUrls;
    private String experienceTag; // "Newbie" or "Experienced"
}
