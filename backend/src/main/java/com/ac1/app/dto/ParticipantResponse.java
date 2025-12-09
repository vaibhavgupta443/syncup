package com.ac1.app.dto;

import com.ac1.app.model.ParticipationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO for participant response.
 */
@Data
@Builder
public class ParticipantResponse {

    private Long id;
    private Long activityId;
    private Long userId;
    private String userName;
    private String userPhotoUrl;
    private Double userRating;
    private ParticipationStatus status;
    private LocalDateTime requestedAt;
}
