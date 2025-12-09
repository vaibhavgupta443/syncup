package com.ac1.app.controller;

import com.ac1.app.dto.FeedbackRequest;
import com.ac1.app.dto.FeedbackResponse;
import com.ac1.app.service.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Controller for feedback and ratings.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    /**
     * Submit feedback for a user in an activity.
     * POST /api/activities/{activityId}/feedback
     */
    @PostMapping("/activities/{activityId}/feedback")
    public ResponseEntity<FeedbackResponse> submitFeedback(
            @PathVariable Long activityId,
            @Valid @RequestBody FeedbackRequest request) {
        FeedbackResponse response = feedbackService.submitFeedback(activityId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get feedback for an activity.
     * GET /api/activities/{activityId}/feedback
     */
    @GetMapping("/activities/{activityId}/feedback")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackForActivity(@PathVariable Long activityId) {
        List<FeedbackResponse> feedback = feedbackService.getFeedbackForActivity(activityId);
        return ResponseEntity.ok(feedback);
    }

    /**
     * Get feedback received by a user.
     * GET /api/users/{userId}/feedback
     */
    @GetMapping("/users/{userId}/feedback")
    public ResponseEntity<List<FeedbackResponse>> getFeedbackForUser(@PathVariable Long userId) {
        List<FeedbackResponse> feedback = feedbackService.getFeedbackForUser(userId);
        return ResponseEntity.ok(feedback);
    }

    /**
     * Get feedback given by current user.
     * GET /api/feedback/my-given
     */
    @GetMapping("/feedback/my-given")
    public ResponseEntity<List<FeedbackResponse>> getMyGivenFeedback() {
        List<FeedbackResponse> feedback = feedbackService.getMyGivenFeedback();
        return ResponseEntity.ok(feedback);
    }
}
