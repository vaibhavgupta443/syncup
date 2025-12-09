package com.ac1.app.controller;

import com.ac1.app.dto.MessageRequest;
import com.ac1.app.dto.MessageResponse;
import com.ac1.app.service.ChatService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller for in-app chat functionality.
 */
@RestController
@RequestMapping("/api/activities/{activityId}/chat")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatController {

    @Autowired
    private ChatService chatService;

    /**
     * Send a message.
     * POST /api/activities/{activityId}/chat
     */
    @PostMapping
    public ResponseEntity<MessageResponse> sendMessage(
            @PathVariable Long activityId,
            @Valid @RequestBody MessageRequest request) {
        MessageResponse response = chatService.sendMessage(activityId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all messages for an activity.
     * GET /api/activities/{activityId}/chat
     */
    @GetMapping
    public ResponseEntity<List<MessageResponse>> getMessages(@PathVariable Long activityId) {
        List<MessageResponse> messages = chatService.getMessages(activityId);
        return ResponseEntity.ok(messages);
    }

    /**
     * Poll for new messages after a timestamp.
     * GET /api/activities/{activityId}/chat/poll?after=2024-01-01T12:00:00
     */
    @GetMapping("/poll")
    public ResponseEntity<List<MessageResponse>> pollNewMessages(
            @PathVariable Long activityId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime after) {
        List<MessageResponse> messages = chatService.pollNewMessages(activityId, after);
        return ResponseEntity.ok(messages);
    }
}
