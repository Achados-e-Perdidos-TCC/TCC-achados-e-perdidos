package com.achadosedevolvidos.item.dto;

import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Atualização parcial: qualquer campo omitido (null) permanece inalterado.
 *
 * "type" e "status" não são editáveis aqui:
 * type é fixo desde a criação e status possui endpoint próprio.
 */
public record UpdateItemRequest(
        UUID categoryId,

        String title,

        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        String description,

        @Size(max = 100, message = "Descrição curta deve ter no máximo 100 caracteres")
        String shortDescription,

        String locationText,

        Double latitude,

        Double longitude,

        LocalDateTime eventDate,

        List<String> imageUrls
) {}