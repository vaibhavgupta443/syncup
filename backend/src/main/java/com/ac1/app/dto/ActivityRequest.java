package com.ac1.app.dto;

import com.ac1.app.model.SkillLevel;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for creating/updating an activity.
 */
@Data
public class ActivityRequest {

    @NotBlank(message = "Activity name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Date and time are required")
    @Future(message = "Activity date must be in the future")
    private LocalDateTime dateTime;

    private SkillLevel requiredSkillLevel;

    @Min(value = 0, message = "Minimum age cannot be negative")
    private Integer minAge;

    @Max(value = 120, message = "Invalid maximum age")
    private Integer maxAge;

    @Min(value = 2, message = "At least 2 participants required")
    private Integer maxParticipants;

    @Min(value = 0, message = "Entry fee cannot be negative")
    private Double entryFee;

    private Set<String> imageUrls;

    // Category-specific data as JSON string
    private String categoryData;
}
