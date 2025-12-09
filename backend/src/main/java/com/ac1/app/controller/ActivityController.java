package com.ac1.app.controller;

import com.ac1.app.dto.*;
import com.ac1.app.model.ActivityStatus;
import com.ac1.app.model.SkillLevel;
import com.ac1.app.service.ActivityService;
import com.ac1.app.service.RecommendationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Controller for activity CRUD and filtering endpoints.
 */
@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ActivityController {

    @Autowired
    private ActivityService activityService;

    @Autowired
    private RecommendationService recommendationService;

    /**
     * Get predefined activity categories.
     * GET /api/activities/categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {
        return ResponseEntity.ok(activityService.getPredefinedCategories());
    }

    /**
     * Create a new activity.
     * POST /api/activities
     */
    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(@Valid @RequestBody ActivityRequest request) {
        ActivityResponse response = activityService.createActivity(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get activity by ID.
     * GET /api/activities/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ActivityResponse> getActivity(@PathVariable Long id) {
        ActivityResponse response = activityService.getActivity(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all activities with pagination.
     * GET /api/activities?page=0&size=10&sort=createdAt,desc
     */
    @GetMapping
    public ResponseEntity<Page<ActivityResponse>> getAllActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<ActivityResponse> activities = activityService.getAllActivities(pageable);
        return ResponseEntity.ok(activities);
    }

    /**
     * Get filtered activities.
     * GET
     * /api/activities/filter?category=Cricket&skillLevel=INTERMEDIATE&location=Delhi
     */
    @GetMapping("/filter")
    public ResponseEntity<Page<ActivityResponse>> getFilteredActivities(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) SkillLevel skillLevel,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) ActivityStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<ActivityResponse> activities = activityService.getFilteredActivities(
                category, skillLevel, location, status, pageable);
        return ResponseEntity.ok(activities);
    }

    /**
     * Get activities created by current user.
     * GET /api/activities/my-created
     */
    @GetMapping("/my-created")
    public ResponseEntity<List<ActivityResponse>> getMyCreatedActivities() {
        List<ActivityResponse> activities = activityService.getMyCreatedActivities();
        return ResponseEntity.ok(activities);
    }

    /**
     * Get activities user has joined.
     * GET /api/activities/my-joined
     */
    @GetMapping("/my-joined")
    public ResponseEntity<List<ActivityResponse>> getMyJoinedActivities() {
        List<ActivityResponse> activities = activityService.getMyJoinedActivities();
        return ResponseEntity.ok(activities);
    }

    /**
     * Get recommended activities.
     * GET /api/activities/recommendations?limit=10
     */
    @GetMapping("/recommendations")
    public ResponseEntity<List<ActivityResponse>> getRecommendations(
            @RequestParam(defaultValue = "10") int limit) {
        List<ActivityResponse> recommendations = recommendationService.getRecommendations(limit);
        return ResponseEntity.ok(recommendations);
    }

    /**
     * Update an activity.
     * PUT /api/activities/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponse> updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityRequest request) {
        ActivityResponse response = activityService.updateActivity(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Mark activity as completed.
     * POST /api/activities/{id}/complete
     */
    @PostMapping("/{id}/complete")
    public ResponseEntity<ActivityResponse> completeActivity(@PathVariable Long id) {
        ActivityResponse response = activityService.completeActivity(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete an activity (soft delete).
     * DELETE /api/activities/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return ResponseEntity.ok(Map.of("message", "Activity deleted successfully"));
    }
}
