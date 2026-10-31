package com.achadosedevolvidos.notification.service;

import com.achadosedevolvidos.auth.dto.MessageResponse;
import com.achadosedevolvidos.notification.dto.NotificationResponse;
import com.achadosedevolvidos.notification.mapper.NotificationMapper;
import com.achadosedevolvidos.notification.model.Notification;
import com.achadosedevolvidos.notification.repository.NotificationRepository;
import com.achadosedevolvidos.shared.exception.AppException;
import com.achadosedevolvidos.user.model.User;
import com.achadosedevolvidos.user.model.UserPreferences;
import com.achadosedevolvidos.user.repository.UserPreferencesRepository;
import com.achadosedevolvidos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> list(UUID currentUserId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUserId).stream()
                .map(notificationMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public NotificationResponse markAsRead(UUID currentUserId, UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new AppException("Notificação não encontrada", HttpStatus.NOT_FOUND));

        if (!notification.getUser().getId().equals(currentUserId)) {
            throw new AppException("Você não tem permissão para alterar esta notificação", HttpStatus.FORBIDDEN);
        }

        notification.setRead(true);
        return notificationMapper.toResponse(notificationRepository.save(notification));
    }

    @Override
    @Transactional
    public MessageResponse markAllAsRead(UUID currentUserId) {
        notificationRepository.markAllAsReadByUserId(currentUserId);
        return new MessageResponse("Notificações marcadas como lidas.");
    }

    /**
     * Respeita notificationsEnabled (o "interruptor geral"). Sem linha em
     * user_preferences ainda = tudo habilitado (mesmo default usado em
     * GET /users/me) — não bloqueia a criação só porque o usuário nunca abriu
     * a tela de preferências.
     */
    @Override
    @Transactional
    public void create(UUID userId, Notification.NotificationType type, String title, String message) {
        UserPreferences preferences = userPreferencesRepository.findByUserId(userId).orElse(null);

        boolean enabled = preferences == null || preferences.isNotificationsEnabled();

        if (!enabled) {
            return;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Usuário não encontrado", HttpStatus.UNAUTHORIZED));

        notificationRepository.save(Notification.builder()
                .user(user)
                .type(type)
                .title(title)
                .message(message)
                .build());
    }
}
