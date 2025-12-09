package com.ac1.app.dto;

import com.ac1.app.model.ActivityStatus;
import com.ac1.app.model.SkillLevel;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

/**
 * DTO for activity response.
 */
@Data
@Builder
public class ActivityResponse {

    private Long id;
    private String name;
    private String category;
    private String description;
    private String location;
    private LocalDateTime dateTime;
    private SkillLevel requiredSkillLevel;
    private Integer minAge;
    private Integer maxAge;
    private Integer maxParticipants;
    private Integer currentParticipants;
    private Double entryFee;
    private ActivityStatus status;
    private Set<String> imageUrls;
    private LocalDateTime createdAt;

    // Creator info
    private Long creatorId;
    private String creatorName;
    private String creatorPhotoUrl;
    private Double creatorRating;
}
