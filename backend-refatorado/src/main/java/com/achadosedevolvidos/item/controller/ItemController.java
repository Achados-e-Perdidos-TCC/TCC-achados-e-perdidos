package com.achadosedevolvidos.item.controller;

import com.achadosedevolvidos.item.dto.CreateItemRequest;
import com.achadosedevolvidos.item.dto.ItemResponse;
import com.achadosedevolvidos.item.dto.ItemSearchFilter;
import com.achadosedevolvidos.item.dto.UpdateItemRequest;
import com.achadosedevolvidos.item.dto.UpdateItemStatusRequest;
import com.achadosedevolvidos.item.model.Item;
import com.achadosedevolvidos.item.service.ItemService;
import com.achadosedevolvidos.match.dto.MatchResponse;
import com.achadosedevolvidos.match.service.MatchService;
import com.achadosedevolvidos.user.model.AuthenticatedUser;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Substitui os dois Controllers conflitantes do repositório original (um em
 * com.achadosedevolvidos.controller, outro em com.example.api.controller, ambos
 * mapeando /api/v1/items). O usuário autenticado agora vem de
 * {@code @AuthenticationPrincipal}. Antes, {@code create()} lia um
 * {@code @RequestAttribute("userId")} que nenhum filtro no projeto chegava a
 * preencher.
 */
@RestController
@RequestMapping("/api/v1/items")
@RequiredArgsConstructor
public class ItemController {

    private final ItemService itemService;
    private final MatchService matchService;

    @PostMapping
    public ResponseEntity<ItemResponse> create(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @Valid @RequestBody CreateItemRequest request
    ) {
        ItemResponse created = itemService.createAndAnalyze(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ItemResponse>> search(
            @RequestParam(required = false) Item.ItemType type,
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String locationText,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo,
            @RequestParam(required = false) Double lat,
            @RequestParam(required = false) Double lng,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        ItemSearchFilter filter = new ItemSearchFilter(
                type,
                categoryId,
                query,
                locationText,
                dateFrom == null ? null : dateFrom.atStartOfDay(),
                dateTo == null ? null : dateTo.atTime(23, 59, 59),
                lat,
                lng
        );
        return ResponseEntity.ok(itemService.search(filter, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ItemResponse> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(itemService.findById(id));
    }

    @GetMapping("/{id}/matches")
    public ResponseEntity<List<MatchResponse>> getMatches(@PathVariable UUID id) {
        return ResponseEntity.ok(matchService.findMatchesForItem(id));
    }

    /**
     * "status" aceita valor de type (PERDIDO/ENCONTRADO) OU de status
     * (ANALISANDO/PROCURANDO/POSSIVEL_MATCH/RESOLVIDO/INATIVO) — ver
     * {@code ItemServiceImpl.parseCombinedStatusFilter}.
     */
    @GetMapping("/me")
    public ResponseEntity<Page<ItemResponse>> findMine(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @RequestParam(required = false) String status,
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        return ResponseEntity.ok(itemService.findMine(currentUser.getId(), status, pageable));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ItemResponse> update(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateItemRequest request
    ) {
        return ResponseEntity.ok(itemService.update(currentUser.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable UUID id
    ) {
        itemService.delete(currentUser.getId(), id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ItemResponse> updateStatus(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateItemStatusRequest request
    ) {
        return ResponseEntity.ok(itemService.updateStatus(currentUser.getId(), id, request.status()));
    }
}
