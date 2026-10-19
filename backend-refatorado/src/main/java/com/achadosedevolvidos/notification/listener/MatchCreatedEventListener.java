package com.achadosedevolvidos.notification.listener;

import com.achadosedevolvidos.match.event.MatchCreatedEvent;
import com.achadosedevolvidos.notification.model.Notification;
import com.achadosedevolvidos.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

/** Avisa os dois donos de item do match — cada um recebe a notificação citando o próprio objeto. */
@Component
@RequiredArgsConstructor
@Slf4j
public class MatchCreatedEventListener {

    private final NotificationService notificationService;

    @Async("taskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onMatchCreated(MatchCreatedEvent event) {
        try {
            notificationService.create(
                    event.lostItemOwnerId(),
                    Notification.NotificationType.POSSIBLE_MATCH,
                    "Possível correspondência encontrada",
                    "Encontramos uma possível correspondência para o objeto \"" + event.lostItemTitle() + "\"."
            );
            notificationService.create(
                    event.foundItemOwnerId(),
                    Notification.NotificationType.POSSIBLE_MATCH,
                    "Possível correspondência encontrada",
                    "Encontramos uma possível correspondência para o objeto \"" + event.foundItemTitle() + "\"."
            );
        } catch (Exception e) {
            log.error("Falha ao criar notificação de match para o match {}", event.matchId(), e);
        }
    }
}
