package com.ac1.app.dto;

import com.ac1.app.model.SkillLevel;
import lombok.Data;
import java.util.Set;

/**
 * DTO for creating/updating user profile.
 */
@Data
public class ProfileRequest {

    private String bio;
    private String location;
    private SkillLevel skillLevel;
    private String interests; // comma-separated
    private Set<String> photoUrls;
}
