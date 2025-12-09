package com.ac1.app.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * DTO for user registration request.
 */
@Data
public class RegisterRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Min(value = 13, message = "Must be at least 13 years old")
    @Max(value = 120, message = "Invalid age")
    private Integer age;

    private String profilePhotoUrl;
}
