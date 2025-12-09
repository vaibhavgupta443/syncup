package com.ac1.app.controller;

import com.ac1.app.dto.*;
import com.ac1.app.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for user profile endpoints.
 */
@RestController
@RequestMapping("/api/profiles")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    /**
     * Get current user's profile.
     * GET /api/profiles/me
     */
    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> getMyProfile() {
        ProfileResponse response = profileService.getMyProfile();
        return ResponseEntity.ok(response);
    }

    /**
     * Get profile by user ID.
     * GET /api/profiles/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ProfileResponse> getProfile(@PathVariable Long userId) {
        ProfileResponse response = profileService.getProfile(userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Create or update current user's profile.
     * POST /api/profiles
     */
    @PostMapping
    public ResponseEntity<ProfileResponse> createOrUpdateProfile(@Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.createOrUpdateProfile(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Update current user's profile.
     * PUT /api/profiles
     */
    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(@Valid @RequestBody ProfileRequest request) {
        ProfileResponse response = profileService.createOrUpdateProfile(request);
        return ResponseEntity.ok(response);
    }
}
