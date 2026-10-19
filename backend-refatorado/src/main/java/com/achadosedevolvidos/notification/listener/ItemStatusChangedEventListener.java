package com.achadosedevolvidos.notification.listener;

import com.achadosedevolvidos.item.event.ItemStatusChangedEvent;
import com.achadosedevolvidos.notification.model.Notification;
import com.achadosedevolvidos.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
@RequiredArgsConstructor
@Slf4j
public class ItemStatusChangedEventListener {

    private final NotificationService notificationService;

    @Async("taskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onItemStatusChanged(ItemStatusChangedEvent event) {
        try {
            notificationService.create(
                    event.ownerId(),
                    Notification.NotificationType.ITEM_UPDATED,
                    "Objeto atualizado",
                    "O status do seu objeto \"" + event.itemTitle() + "\" foi atualizado."
            );
        } catch (Exception e) {
            log.error("Falha ao criar notificação de status para o item {}", event.itemId(), e);
        }
    }
}
