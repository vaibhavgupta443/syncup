package com.ac1.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO for sending a message.
 */
@Data
public class MessageRequest {

    @NotBlank(message = "Message content is required")
    private String content;
}
