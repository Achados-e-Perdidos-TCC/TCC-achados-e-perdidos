package com.achadosedevolvidos.item.dto;

import com.achadosedevolvidos.item.model.Item;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * lat/lng ficam reservados para uma futura busca por proximidade (hoje não
 * aplicada na consulta — ver observação em {@code ItemSpecifications}).
 *
 * <p>dateFrom/dateTo já vêm convertidos para os limites do dia (início/fim) pelo
 * Controller — ver {@code ItemController.search} — para filtrar por
 * {@code eventDate} usando um intervalo inclusivo de dias inteiros.</p>
 */
public record ItemSearchFilter(
        Item.ItemType type,
        UUID categoryId,
        String query,
        String locationText,
        LocalDateTime dateFrom,
        LocalDateTime dateTo,
        Double latitude,
        Double longitude
) {}
