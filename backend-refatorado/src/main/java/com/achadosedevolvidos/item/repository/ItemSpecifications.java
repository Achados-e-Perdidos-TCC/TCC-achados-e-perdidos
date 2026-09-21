package com.achadosedevolvidos.item.repository;

import com.achadosedevolvidos.item.dto.ItemSearchFilter;
import com.achadosedevolvidos.item.model.Item;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Mantém a lógica de filtros fora do Controller e do Service: cada filtro é uma
 * Specification isolada, testável separadamente e combinável com "and".
 *
 * <p>lat/lng ainda não são usados aqui: uma busca por raio geográfico correta
 * precisaria de PostGIS (ou de uma expressão Haversine em SQL nativo), o que foi
 * deixado como próximo passo em vez de uma implementação aproximada e incorreta.</p>
 */
public final class ItemSpecifications {

    private ItemSpecifications() {}

    public static Specification<Item> withFilters(ItemSearchFilter filter) {
        return Specification
                .where(hasType(filter.type()))
                .and(hasCategory(filter.categoryId()))
                .and(matchesQuery(filter.query()))
                .and(hasLocationText(filter.locationText()))
                .and(eventDateBetween(filter.dateFrom(), filter.dateTo()))
                // Item "excluído" (DELETE /items/{id}) é soft-delete via
                // status=INATIVO — nunca deve aparecer na busca pública.
                .and(statusNot(Item.ItemStatus.INATIVO));
    }

    public static Specification<Item> hasUserId(UUID userId) {
        return (root, query, cb) -> userId == null ? null : cb.equal(root.get("user").get("id"), userId);
    }

    public static Specification<Item> hasStatus(Item.ItemStatus status) {
        return (root, query, cb) -> status == null ? null : cb.equal(root.get("status"), status);
    }

    public static Specification<Item> statusNot(Item.ItemStatus status) {
        return (root, query, cb) -> status == null ? null : cb.notEqual(root.get("status"), status);
    }

    public static Specification<Item> hasType(Item.ItemType type) {
        return (root, query, cb) -> type == null ? null : cb.equal(root.get("type"), type);
    }

    public static Specification<Item> hasCategory(UUID categoryId) {
        return (root, query, cb) -> categoryId == null
                ? null
                : cb.equal(root.get("category").get("id"), categoryId);
    }

    public static Specification<Item> matchesQuery(String text) {
        return (root, query, cb) -> {
            if (text == null || text.isBlank()) {
                return null;
            }
            String like = "%" + text.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("title")), like),
                    cb.like(cb.lower(root.get("description")), like)
            );
        };
    }

    public static Specification<Item> hasLocationText(String locationText) {
        return (root, query, cb) -> {
            if (locationText == null || locationText.isBlank()) {
                return null;
            }
            return cb.like(cb.lower(root.get("locationText")), "%" + locationText.toLowerCase() + "%");
        };
    }

    /**
     * Qualquer um dos dois lados pode vir nulo (busca só com "a partir de" ou só
     * com "até"); itens sem eventDate nunca batem quando algum dos dois filtros
     * está presente, já que não há data para comparar.
     */
    public static Specification<Item> eventDateBetween(LocalDateTime from, LocalDateTime to) {
        return (root, query, cb) -> {
            if (from == null && to == null) {
                return null;
            }
            if (from != null && to != null) {
                return cb.between(root.get("eventDate"), from, to);
            }
            if (from != null) {
                return cb.greaterThanOrEqualTo(root.get("eventDate"), from);
            }
            return cb.lessThanOrEqualTo(root.get("eventDate"), to);
        };
    }
}
