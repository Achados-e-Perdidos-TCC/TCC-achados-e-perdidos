package com.achadosedevolvidos.item.dto;

import com.achadosedevolvidos.item.model.Item;
import jakarta.validation.constraints.NotNull;

public record UpdateItemStatusRequest(
        @NotNull(message = "Status é obrigatório")
        Item.ItemStatus status
) {}
