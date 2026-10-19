package com.achadosedevolvidos.notification.service;

import com.achadosedevolvidos.auth.dto.MessageResponse;
import com.achadosedevolvidos.notification.dto.NotificationResponse;
import com.achadosedevolvidos.notification.model.Notification;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    List<NotificationResponse> list(UUID currentUserId);

    NotificationResponse markAsRead(UUID currentUserId, UUID notificationId);

    MessageResponse markAllAsRead(UUID currentUserId);

    /**
     * Cria a notificação respeitando a preferência do usuário (ver
     * NotificationServiceImpl) — chamado pelos listeners de evento dos outros
     * módulos, nunca direto por um Controller.
     */
    void create(UUID userId, Notification.NotificationType type, String title, String message);
}
