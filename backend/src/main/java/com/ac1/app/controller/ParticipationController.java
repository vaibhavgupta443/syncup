package com.ac1.app.controller;

import com.ac1.app.dto.ParticipantResponse;
import com.ac1.app.service.ParticipationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * Controller for activity participation (join/approve/reject).
 */
@RestController
@RequestMapping("/api/activities/{activityId}/participants")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ParticipationController {

    @Autowired
    private ParticipationService participationService;

    /**
     * Request to join an activity.
     * POST /api/activities/{activityId}/participants/join
     */
    @PostMapping("/join")
    public ResponseEntity<ParticipantResponse> requestToJoin(@PathVariable Long activityId) {
        ParticipantResponse response = participationService.requestToJoin(activityId);
        return ResponseEntity.ok(response);
    }

    /**
     * Get pending join requests (for activity creator).
     * GET /api/activities/{activityId}/participants/pending
     */
    @GetMapping("/pending")
    public ResponseEntity<List<ParticipantResponse>> getPendingRequests(@PathVariable Long activityId) {
        List<ParticipantResponse> requests = participationService.getPendingRequests(activityId);
        return ResponseEntity.ok(requests);
    }

    /**
     * Get approved participants.
     * GET /api/activities/{activityId}/participants
     */
    @GetMapping
    public ResponseEntity<List<ParticipantResponse>> getApprovedParticipants(@PathVariable Long activityId) {
        List<ParticipantResponse> participants = participationService.getApprovedParticipants(activityId);
        return ResponseEntity.ok(participants);
    }

    /**
     * Get current user's participation status.
     * GET /api/activities/{activityId}/participants/my-status
     */
    @GetMapping("/my-status")
    public ResponseEntity<?> getMyParticipation(@PathVariable Long activityId) {
        ParticipantResponse response = participationService.getMyParticipation(activityId);
        if (response == null) {
            return ResponseEntity.ok(Map.of("status", "NOT_JOINED"));
        }
        return ResponseEntity.ok(response);
    }

    /**
     * Approve a join request.
     * POST /api/activities/{activityId}/participants/{participantId}/approve
     */
    @PostMapping("/{participantId}/approve")
    public ResponseEntity<ParticipantResponse> approveRequest(
            @PathVariable Long activityId,
            @PathVariable Long participantId) {
        ParticipantResponse response = participationService.approveRequest(participantId);
        return ResponseEntity.ok(response);
    }

    /**
     * Reject a join request.
     * POST /api/activities/{activityId}/participants/{participantId}/reject
     */
    @PostMapping("/{participantId}/reject")
    public ResponseEntity<ParticipantResponse> rejectRequest(
            @PathVariable Long activityId,
            @PathVariable Long participantId) {
        ParticipantResponse response = participationService.rejectRequest(participantId);
        return ResponseEntity.ok(response);
    }
}
