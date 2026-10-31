package com.achadosedevolvidos.item.event;

import java.util.UUID;

/**
 * Publicado quando o status de workflow de um item muda (PATCH
 * /items/{id}/status). Quem reage a ele — o módulo notification — não é
 * conhecido pelo ItemService; carrega os dados já prontos (dono, título) pra
 * quem escuta não precisar fazer outra consulta ao item.
 */
public record ItemStatusChangedEvent(UUID itemId, UUID ownerId, String itemTitle) {}
