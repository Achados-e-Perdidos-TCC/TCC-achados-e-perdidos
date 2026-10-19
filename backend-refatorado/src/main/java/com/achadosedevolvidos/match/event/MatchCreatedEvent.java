package com.achadosedevolvidos.match.event;

import java.util.UUID;

/**
 * Publicado quando um match novo é persistido (score acima do limite mínimo).
 * Carrega os dados dos dois donos de item pra quem escuta — o módulo
 * notification — poder avisar os dois sem precisar conhecer a entidade Match.
 */
public record MatchCreatedEvent(
        UUID matchId,
        UUID lostItemOwnerId,
        String lostItemTitle,
        UUID foundItemOwnerId,
        String foundItemTitle
) {}
