package com.achadosedevolvidos.notification.dto;

import com.achadosedevolvidos.notification.model.Notification;

import java.time.LocalDateTime;
import java.util.UUID;

public record NotificationResponse(
        UUID id,
        Notification.NotificationType type,
        String title,
        String message,
        LocalDateTime createdAt,
        boolean read
) {}
