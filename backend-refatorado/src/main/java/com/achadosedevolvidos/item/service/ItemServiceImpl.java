
package com.achadosedevolvidos.item.service;

import com.achadosedevolvidos.category.model.Category;
import com.achadosedevolvidos.category.repository.CategoryRepository;
import com.achadosedevolvidos.item.dto.CreateItemRequest;
import com.achadosedevolvidos.item.dto.ItemResponse;
import com.achadosedevolvidos.item.dto.ItemSearchFilter;
import com.achadosedevolvidos.item.dto.UpdateItemRequest;
import com.achadosedevolvidos.item.event.ItemStatusChangedEvent;
import com.achadosedevolvidos.item.mapper.ItemMapper;
import com.achadosedevolvidos.item.model.Item;
import com.achadosedevolvidos.item.model.ItemImage;
import com.achadosedevolvidos.item.repository.ItemRepository;
import com.achadosedevolvidos.item.repository.ItemSpecifications;
import com.achadosedevolvidos.shared.exception.AppException;
import com.achadosedevolvidos.user.model.User;
import com.achadosedevolvidos.user.model.UserPreferences;
import com.achadosedevolvidos.user.repository.UserPreferencesRepository;
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

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {

    private final ItemRepository itemRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final ItemMapper itemMapper;
    private final ApplicationEventPublisher eventPublisher;

    @Override
    @Transactional
    public ItemResponse create(UUID currentUserId, CreateItemRequest request) {
        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new AppException(
                        "Usuário não encontrado",
                        HttpStatus.UNAUTHORIZED
                ));

        Category category = categoryRepository.findById(request.categoryId())
                .orElseThrow(() -> new AppException(
                        "Categoria não encontrada",
                        HttpStatus.BAD_REQUEST
                ));

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

        return itemMapper.toResponse(saved);
    }

    /**
     * Realiza a busca pública de itens utilizando os filtros
     * definidos em ItemSearchFilter e ItemSpecifications.
     *
     * Itens com status INATIVO não aparecem na busca pública,
     * conforme definido em ItemSpecifications.withFilters().
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ItemResponse> search(
            ItemSearchFilter filter,
            Pageable pageable
    ) {
        Specification<Item> spec = ItemSpecifications.withFilters(filter);

        return itemRepository.findAll(spec, pageable)
                .map(itemMapper::toResponse);
    }

    /**
     * Lista os itens do próprio usuário.
     *
     * Por padrão, itens com status INATIVO não aparecem na listagem.
     * Para consultar o histórico de objetos excluídos, é possível
     * informar explicitamente status=INATIVO.
     *
     * O filtro status aceita tanto ItemType
     * (PERDIDO/ENCONTRADO) quanto ItemStatus
     * (ANALISANDO/PROCURANDO/RESOLVIDO/INATIVO).
     */
    @Override
    @Transactional(readOnly = true)
    public Page<ItemResponse> findMine(
            UUID currentUserId,
            String status,
            Pageable pageable
    ) {
        Specification<Item> spec = Specification
                .where(ItemSpecifications.hasUserId(currentUserId));

        // Oculta os objetos inativos da listagem normal.
        // Eles só aparecem quando o usuário solicita INATIVO.
        spec = spec.and(ItemSpecifications.notDeleted());


        // Aplica o filtro solicitado, quando informado.
        spec = spec.and(parseCombinedStatusFilter(status));

        return itemRepository.findAll(spec, pageable)
                .map(itemMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ItemResponse findById(UUID id) {
        Item item = itemRepository.findById(id)
                .orElseThrow(() -> new AppException(
                        "Item não encontrado",
                        HttpStatus.NOT_FOUND
                ));

        // Itens INATIVO não aparecem no detalhe público.
        if (item.isDeleted()) {
            throw new AppException(
                    "Item não encontrado",
                    HttpStatus.NOT_FOUND
            );
        }

        return itemMapper.toResponse(
                item,
                resolveEmailResponsavel(item)
        );
    }

    /**
     * O detalhe público mostra o e-mail do dono somente se
     * a preferência showEmailOnItems estiver habilitada.
     */
    private String resolveEmailResponsavel(Item item) {
        UUID ownerId = item.getUser().getId();

        boolean showEmail = userPreferencesRepository
                .findByUserId(ownerId)
                .map(UserPreferences::isShowEmailOnItems)
                .orElse(true);

        return showEmail ? item.getUser().getEmail() : null;
    }

    @Override
    @Transactional
    public ItemResponse update(
            UUID currentUserId,
            UUID itemId,
            UpdateItemRequest request
    ) {
        Item item = findItemOrThrow(itemId);
        ensureOwner(item, currentUserId);

        if (request.categoryId() != null) {
            Category category = categoryRepository.findById(request.categoryId())
                    .orElseThrow(() -> new AppException(
                            "Categoria não encontrada",
                            HttpStatus.BAD_REQUEST
                    ));

            item.setCategory(category);
        }

        if (request.title() != null) {
            requireNotBlank(
                    request.title(),
                    "Título não pode ser vazio"
            );
            item.setTitle(request.title());
        }

        if (request.description() != null) {
            requireNotBlank(
                    request.description(),
                    "Descrição não pode ser vazia"
            );
            item.setDescription(request.description());
        }

        if (request.shortDescription() != null) {
            String shortDescription = request.shortDescription().trim();

            if (shortDescription.length() > 100) {
                throw new AppException(
                        "Descrição curta deve ter no máximo 100 caracteres",
                        HttpStatus.BAD_REQUEST
                );
            }

            item.setShortDescription(
                    shortDescription.isBlank() ? null : shortDescription
            );
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
            item.getImages().addAll(
                    buildImages(item, request.imageUrls())
            );
        }

        return itemMapper.toResponse(itemRepository.save(item));
    }

    /**
     * Soft delete: altera o status para INATIVO,
     * mantendo o registro no banco para o histórico do dono.
     */
        @Override
        @Transactional
                public void delete(UUID currentUserId, UUID itemId) {
        Item item = findItemOrThrow(itemId);
        ensureOwner(item, currentUserId);

        item.setDeleted(true);
        itemRepository.save(item);
        }

    @Override
    @Transactional
    public ItemResponse updateStatus(
            UUID currentUserId,
            UUID itemId,
            Item.ItemStatus newStatus
    ) {
        Item item = findItemOrThrow(itemId);
        ensureOwner(item, currentUserId);

        item.setStatus(newStatus);

        Item saved = itemRepository.save(item);

        eventPublisher.publishEvent(
                new ItemStatusChangedEvent(
                        saved.getId(),
                        currentUserId,
                        saved.getTitle()
                )
        );

        return itemMapper.toResponse(saved);
    }

    /**
     * Aceita filtros tanto de tipo (PERDIDO/ENCONTRADO)
     * quanto de status (ANALISANDO/PROCURANDO/RESOLVIDO/INATIVO).
     */
    private Specification<Item> parseCombinedStatusFilter(String rawStatus) {
        if (rawStatus == null || rawStatus.isBlank()) {
            return null;
        }

        String normalized = rawStatus.trim().toUpperCase();

        try {
            return ItemSpecifications.hasType(
                    Item.ItemType.valueOf(normalized)
            );
        } catch (IllegalArgumentException notAType) {
            try {
                return ItemSpecifications.hasStatus(
                        Item.ItemStatus.valueOf(normalized)
                );
            } catch (IllegalArgumentException notAStatusEither) {
                throw new AppException(
                        "Status inválido: " + rawStatus,
                        HttpStatus.BAD_REQUEST
                );
            }
        }
    }

    private Item findItemOrThrow(UUID itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new AppException(
                        "Item não encontrado",
                        HttpStatus.NOT_FOUND
                ));
    }

    private void ensureOwner(Item item, UUID currentUserId) {
        if (!item.getUser().getId().equals(currentUserId)) {
            throw new AppException(
                    "Você não tem permissão para alterar este item",
                    HttpStatus.FORBIDDEN
            );
        }
    }

    private void requireNotBlank(String value, String message) {
        if (value.isBlank()) {
            throw new AppException(
                    message,
                    HttpStatus.BAD_REQUEST
            );
        }
    }

    private List<ItemImage> buildImages(
            Item item,
            List<String> imageUrls
    ) {
        List<ItemImage> images = new ArrayList<>();

        if (imageUrls == null) {
            return images;
        }

        int order = 0;

        for (String url : imageUrls) {
            images.add(
                    ItemImage.builder()
                            .item(item)
                            .url(url)
                            .displayOrder(order++)
                            .build()
            );
        }

        return images;
    }
}
