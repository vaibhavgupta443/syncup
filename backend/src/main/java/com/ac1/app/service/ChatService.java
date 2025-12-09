package com.ac1.app.service;

import com.ac1.app.dto.MessageRequest;
import com.ac1.app.dto.MessageResponse;
import com.ac1.app.exception.BadRequestException;
import com.ac1.app.exception.ResourceNotFoundException;
import com.ac1.app.model.*;
import com.ac1.app.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for in-app chat functionality.
 */
@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private ParticipationService participationService;

    @Autowired
    private AuthService authService;

    /**
     * Send a message to an activity chat.
     */
    @Transactional
    public MessageResponse sendMessage(Long activityId, MessageRequest request) {
        User currentUser = authService.getCurrentUser();
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        // Check if user is approved participant
        if (!participationService.isApprovedParticipant(activityId, currentUser.getId())) {
            throw new BadRequestException("You must be an approved participant to send messages");
        }

        Message message = Message.builder()
                .activity(activity)
                .sender(currentUser)
                .content(request.getContent())
                .build();

        message = messageRepository.save(message);

        return mapToMessageResponse(message);
    }

    /**
     * Get all messages for an activity.
     */
    public List<MessageResponse> getMessages(Long activityId) {
        User currentUser = authService.getCurrentUser();
        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResourceNotFoundException("Activity", "id", activityId));

        // Check if user is approved participant
        if (!participationService.isApprovedParticipant(activityId, currentUser.getId())) {
            throw new BadRequestException("You must be an approved participant to view messages");
        }

        return messageRepository.findByActivityIdOrderByTimestampAsc(activityId)
                .stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    /**
     * Get messages with pagination.
     */
    public Page<MessageResponse> getMessagesPaginated(Long activityId, Pageable pageable) {
        User currentUser = authService.getCurrentUser();

        if (!participationService.isApprovedParticipant(activityId, currentUser.getId())) {
            throw new BadRequestException("You must be an approved participant to view messages");
        }

        return messageRepository.findByActivityIdOrderByTimestampAsc(activityId, pageable)
                .map(this::mapToMessageResponse);
    }

    /**
     * Poll for new messages after a timestamp.
     */
    public List<MessageResponse> pollNewMessages(Long activityId, LocalDateTime after) {
        User currentUser = authService.getCurrentUser();

        if (!participationService.isApprovedParticipant(activityId, currentUser.getId())) {
            throw new BadRequestException("You must be an approved participant to view messages");
        }

        return messageRepository.findByActivityIdAndTimestampAfterOrderByTimestampAsc(activityId, after)
                .stream()
                .map(this::mapToMessageResponse)
                .collect(Collectors.toList());
    }

    /**
     * Map to response DTO.
     */
    private MessageResponse mapToMessageResponse(Message message) {
        User sender = message.getSender();
        return MessageResponse.builder()
                .id(message.getId())
                .activityId(message.getActivity().getId())
                .senderId(sender.getId())
                .senderName(sender.getFullName())
                .senderPhotoUrl(sender.getProfilePhotoUrl())
                .content(message.getContent())
                .timestamp(message.getTimestamp())
                .build();
    }
}
