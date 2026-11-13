package com.achadosedevolvidos.item.dto;

import com.achadosedevolvidos.item.model.Item;
import jakarta.validation.constraints.NotNull;

public record UpdateItemTypeRequest(
        @NotNull(message = "Tipo é obrigatório")
        Item.ItemType type
) {}
