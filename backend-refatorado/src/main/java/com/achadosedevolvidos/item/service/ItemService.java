package com.achadosedevolvidos.item.service;

import com.achadosedevolvidos.item.dto.CreateItemRequest;
import com.achadosedevolvidos.item.dto.ItemResponse;
import com.achadosedevolvidos.item.dto.ItemSearchFilter;
import com.achadosedevolvidos.item.dto.UpdateItemRequest;
import com.achadosedevolvidos.item.model.Item;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ItemService {

    ItemResponse createAndAnalyze(UUID currentUserId, CreateItemRequest request);

    Page<ItemResponse> search(ItemSearchFilter filter, Pageable pageable);

    ItemResponse findById(UUID id);

    Page<ItemResponse> findMine(UUID currentUserId, String status, Pageable pageable);

    ItemResponse update(UUID currentUserId, UUID itemId, UpdateItemRequest request);

    void delete(UUID currentUserId, UUID itemId);

    ItemResponse updateStatus(UUID currentUserId, UUID itemId, Item.ItemStatus newStatus);
}
