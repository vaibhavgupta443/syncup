package com.ac1.app.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO for message response.
 */
@Data
@Builder
public class MessageResponse {

    private Long id;
    private Long activityId;
    private Long senderId;
    private String senderName;
    private String senderPhotoUrl;
    private String content;
    private LocalDateTime timestamp;
}
