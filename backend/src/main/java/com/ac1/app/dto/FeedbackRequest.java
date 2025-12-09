package com.ac1.app.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO for submitting feedback.
 */
@Data
public class FeedbackRequest {

    @NotNull(message = "Reviewee ID is required")
    private Long revieweeId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    private Integer rating;

    private String comment;
}
