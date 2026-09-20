package com.achadosedevolvidos.item.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Atualização parcial: qualquer campo omitido (null) permanece inalterado —
 * mesmo padrão de {@code UpdateProfileRequest} (user). "type" e "status" não
 * são editáveis aqui: type é fixo desde a criação, status tem endpoint
 * próprio ({@code PATCH /items/{id}/status}).
 */
public record UpdateItemRequest(
        UUID categoryId,
        String title,
        String description,
        String shortDescription,
        String locationText,
        Double latitude,
        Double longitude,
        LocalDateTime eventDate,
        List<String> imageUrls
) {}
