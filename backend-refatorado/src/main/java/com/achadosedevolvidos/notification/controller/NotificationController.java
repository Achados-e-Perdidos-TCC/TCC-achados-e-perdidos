package com.achadosedevolvidos.notification.controller;

import com.achadosedevolvidos.auth.dto.MessageResponse;
import com.achadosedevolvidos.notification.dto.NotificationResponse;
import com.achadosedevolvidos.notification.service.NotificationService;
import com.achadosedevolvidos.user.model.AuthenticatedUser;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationResponse>> list(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        return ResponseEntity.ok(notificationService.list(currentUser.getId()));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<MessageResponse> markAllAsRead(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        return ResponseEntity.ok(notificationService.markAllAsRead(currentUser.getId()));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<NotificationResponse> markAsRead(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable UUID id
    ) {
        return ResponseEntity.ok(notificationService.markAsRead(currentUser.getId(), id));
    }
}
