package com.achadosedevolvidos.item.service;

import com.achadosedevolvidos.category.model.Category;
import com.achadosedevolvidos.category.repository.CategoryRepository;
import com.achadosedevolvidos.item.dto.CreateItemRequest;
import com.achadosedevolvidos.item.dto.ItemResponse;
import com.achadosedevolvidos.item.dto.ItemSearchFilter;
import com.achadosedevolvidos.item.dto.UpdateItemRequest;
import com.achadosedevolvidos.item.event.ItemCreatedEvent;
import com.achadosedevolvidos.item.mapper.ItemMapper;
import com.achadosedevolvidos.item.model.Item;
import com.achadosedevolvidos.item.model.ItemImage;
import com.achadosedevolvidos.item.repository.ItemRepository;
import com.achadosedevolvidos.item.repository.ItemSpecifications;
import com.achadosedevolvidos.shared.exception.AppException;
import com.achadosedevolvidos.user.model.User;
import com.achadosedevolvidos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Propositalmente NÃO depende de MatchService (nem de nada do módulo match):
 * ao criar um item, só publica {@link ItemCreatedEvent} e segue em frente. Quem
 * reage a esse evento (o motor de match) é decidido em outro módulo, de forma
 * assíncrona e após o commit da transação — ver
 * {@code match.listener.ItemCreatedEventListener}.
 */
@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final ItemMapper itemMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public ItemResponse createAndAnalyze(UUID currentUserId, CreateItemRequest request) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException("Usuário não encontrado", HttpStatus.UNAUTHORIZED));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new AppException("Categoria não encontrada", HttpStatus.BAD_REQUEST));

        Item item = Item.builder()
                .user(user)
                .category(category)
                .type(request.type())
                .title(request.title())
                .description(request.description())
                .shortDescription(request.shortDescription())
                .locationText(request.locationText())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .eventDate(request.eventDate())
                .build();

        item.setImages(buildImages(item, request.imageUrls()));

        Item saved = itemRepository.save(item);

        eventPublisher.publishEvent(new ItemCreatedEvent(saved.getId()));

        return itemMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ItemResponse> search(ItemSearchFilter filter, Pageable pageable) {
        return itemRepository.findAll(ItemSpecifications.withFilters(filter), pageable)
                .map(itemMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemResponse findById(UUID id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new AppException("Item não encontrado", HttpStatus.NOT_FOUND));

        // Item com soft-delete (DELETE /items/{id}) não deve aparecer pra quem
        // não é o dono — mesmo resultado de "não existe", pra não vazar que
        // já existiu.
        if (item.getStatus() == Item.ItemStatus.INATIVO) {
            throw new AppException("Item não encontrado", HttpStatus.NOT_FOUND);
        }

        return itemMapper.toResponse(item);
    }

    /**
     * "status" aqui aceita tanto um valor de {@code Item.ItemType}
     * (PERDIDO/ENCONTRADO) quanto de {@code Item.ItemStatus}
     * (ANALISANDO/PROCURANDO/POSSIVEL_MATCH/RESOLVIDO/INATIVO) — um único filtro
     * combinado, como pedido pelo front-end pra tela "Meus objetos". Ao
     * contrário da busca pública, itens INATIVO (excluídos pelo próprio dono)
     * continuam visíveis aqui, já que é o histórico do próprio usuário.
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ItemResponse> findMine(UUID currentUserId, String status, Pageable pageable) {
        Specification<Item> spec = Specification.where(ItemSpecifications.hasUserId(currentUserId))
                .and(parseCombinedStatusFilter(status));

        return itemRepository.findAll(spec, pageable).map(itemMapper::toResponse);
    }

    @Override
    @Transactional
    public ItemResponse update(UUID currentUserId, UUID itemId, UpdateItemRequest request) {
        Item item = findItemOrThrow(itemId);
        ensureOwner(item, currentUserId);

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new AppException("Categoria não encontrada", HttpStatus.BAD_REQUEST));
            item.setCategory(category);
        }
        if (request.title() != null) {
            requireNotBlank(request.title(), "Título não pode ser vazio");
            item.setTitle(request.title());
        }
        if (request.description() != null) {
            requireNotBlank(request.description(), "Descrição não pode ser vazia");
            item.setDescription(request.description());
        }
        if (request.shortDescription() != null) {
            requireNotBlank(request.shortDescription(), "Descrição curta não pode ser vazia");
            if (request.shortDescription().length() > 100) {
                throw new AppException("Descrição curta deve ter no máximo 100 caracteres", HttpStatus.BAD_REQUEST);
            }
            item.setShortDescription(request.shortDescription());
        }
        if (request.locationText() != null) {
            item.setLocationText(request.locationText());
        }
        if (request.latitude() != null) {
            item.setLatitude(request.latitude());
        }
        if (request.longitude() != null) {
            item.setLongitude(request.longitude());
        }
        if (request.eventDate() != null) {
            item.setEventDate(request.eventDate());
        }
        if (request.imageUrls() != null) {
            item.getImages().clear();
            item.getImages().addAll(buildImages(item, request.imageUrls()));
        }

        return itemMapper.toResponse(itemRepository.save(item));
    }

    /**
     * Soft delete: marca como INATIVO em vez de apagar a linha — o item pode já
     * ter matches e mensagens de chat vinculados, e não há ON DELETE CASCADE
     * pra essas tabelas.
     */
    @Override
    @Transactional
    public void delete(UUID currentUserId, UUID itemId) {
        Item item = findItemOrThrow(itemId);
        ensureOwner(item, currentUserId);

        item.setStatus(Item.ItemStatus.INATIVO);
        itemRepository.save(item);
    }

    @Override
    @Transactional
    public ItemResponse updateStatus(UUID currentUserId, UUID itemId, Item.ItemStatus newStatus) {
        Item item = findItemOrThrow(itemId);
        ensureOwner(item, currentUserId);

        item.setStatus(newStatus);
        return itemMapper.toResponse(itemRepository.save(item));
    }

    private Specification<Item> parseCombinedStatusFilter(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) {
            return null;
        }

        String normalized = rawStatus.trim().toUpperCase();
        try {
            return ItemSpecifications.hasType(Item.ItemType.valueOf(normalized));
        } catch (IllegalArgumentException notAType) {
            try {
                return ItemSpecifications.hasStatus(Item.ItemStatus.valueOf(normalized));
            } catch (IllegalArgumentException notAStatusEither) {
                throw new AppException("Status inválido: " + rawStatus, HttpStatus.BAD_REQUEST);
            }
        }
    }

    private Item findItemOrThrow(UUID itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new AppException("Item não encontrado", HttpStatus.NOT_FOUND));
    }

    private void ensureOwner(Item item, UUID currentUserId) {
        if (!item.getUser().getId().equals(currentUserId)) {
            throw new AppException("Você não tem permissão para alterar este item", HttpStatus.FORBIDDEN);
        }
    }

    private void requireNotBlank(String value, String message) {
        if (value.isBlank()) {
            throw new AppException(message, HttpStatus.BAD_REQUEST);
        }
    }

    private List<ItemImage> buildImages(Item item, List<String> imageUrls) {
        List<ItemImage> images = new ArrayList<>();
        if (imageUrls == null) {
            return images;
        }
        int order = 0;
        for (String url : imageUrls) {
            images.add(ItemImage.builder().item(item).url(url).displayOrder(order++).build());
        }
        return images;
    }
}
