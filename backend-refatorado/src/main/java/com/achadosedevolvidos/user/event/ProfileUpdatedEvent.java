package com.achadosedevolvidos.user.event;

import java.util.UUID;

/** Publicado quando PATCH /users/me altera o perfil com sucesso. */
public record ProfileUpdatedEvent(UUID userId) {}
