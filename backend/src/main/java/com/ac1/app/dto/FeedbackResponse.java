package com.ac1.app.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO for feedback response.
 */
@Data
@Builder
public class FeedbackResponse {

    private Long id;
    private Long activityId;
    private String activityName;
    private Long reviewerId;
    private String reviewerName;
    private Long revieweeId;
    private String revieweeName;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;
}
