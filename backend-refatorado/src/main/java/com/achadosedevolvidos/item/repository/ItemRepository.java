package com.achadosedevolvidos.item.repository;

import com.achadosedevolvidos.item.model.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ItemRepository extends JpaRepository<Item, UUID>, JpaSpecificationExecutor<Item> {

    /**
     * Usado pelo motor de match para achar candidatos do tipo oposto na mesma
     * categoria, excluindo itens já inativos.
     */
    List<Item> findByTypeAndCategoryIdAndStatusNot(
            Item.ItemType type, UUID categoryId, Item.ItemStatus excludedStatus
    );

    /**
     * Usado por DELETE /users/me (soft delete de conta): marca todos os itens
     * do usuário como INATIVO em vez de apagá-los.
     */
    @Modifying
    @Query("update Item i set i.status = :status where i.user.id = :userId and i.status <> :status")
    void updateStatusForAllByUserId(@Param("userId") UUID userId, @Param("status") Item.ItemStatus status);
}
