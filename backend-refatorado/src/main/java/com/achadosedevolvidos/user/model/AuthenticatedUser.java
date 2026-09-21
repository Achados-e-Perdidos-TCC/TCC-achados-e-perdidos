package com.achadosedevolvidos.user.model;

import java.util.UUID;

/**
 * Contrato implementado por {@link User}, usado pelos Controllers via
 * {@code @AuthenticationPrincipal AuthenticatedUser currentUser} para obter o
 * usuário autenticado (Bearer JWT) sem depender diretamente da entidade JPA.
 */
public interface AuthenticatedUser {

    UUID getId();

    String getEmail();

    User.Role getRole();
}
