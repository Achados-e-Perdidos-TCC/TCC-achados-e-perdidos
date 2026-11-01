package com.achadosedevolvidos.item.dto;

import com.achadosedevolvidos.item.model.Item;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record CreateItemRequest(

        @NotNull(message = "Tipo é obrigatório (PERDIDO ou ENCONTRADO)")
        Item.ItemType type,

        @NotNull(message = "Categoria é obrigatória")
        UUID categoryId,

        @NotBlank(message = "Título é obrigatório")
        String title,

        @NotBlank(message = "Descrição é obrigatória")
        String description,

       @Size(max = 50, message = "Características específicas devem ter no máximo 50 caracteres")
        String shortDescription,

        String locationText,

        Double latitude,
        Double longitude,

        @NotNull(message = "Data do evento é obrigatória")
        @PastOrPresent(message = "Data do evento não pode estar no futuro")
        LocalDateTime eventDate,

        List<String> imageUrls
) {}
