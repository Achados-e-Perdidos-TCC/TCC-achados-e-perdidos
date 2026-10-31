package com.achadosedevolvidos.notification.listener;

import com.achadosedevolvidos.notification.model.Notification;
import com.achadosedevolvidos.notification.service.NotificationService;
import com.achadosedevolvidos.user.event.ProfileUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProfileUpdatedEventListener {

    private final NotificationService notificationService;

    @Async("taskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onProfileUpdated(ProfileUpdatedEvent event) {
        try {
            notificationService.create(
                    event.userId(),
                    Notification.NotificationType.PROFILE_UPDATED,
                    "Perfil atualizado",
                    "Seus dados de perfil foram atualizados com sucesso."
            );
        } catch (Exception e) {
            log.error("Falha ao criar notificação de perfil para o usuário {}", event.userId(), e);
        }
    }
}
