package com.achadosedevolvidos.item.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

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
        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        String description,
        @Size(max = 100, message = "Descrição curta deve ter no máximo 100 caracteres")
        String shortDescription,
        @Pattern(regexp = "[A-Za-z]{2}", message = "Estado deve ser a sigla com 2 letras (ex.: RS)")
        String estado,
        String cidade,
        String bairro,
        Double latitude,
        Double longitude,
        LocalDateTime eventDate,
        List<String> imageUrls
) {}