package com.achadosedevolvidos.user.dto;

/**
 * Atualização parcial: qualquer campo omitido (null) permanece inalterado,
 * mesmo padrão de {@link UpdateProfileRequest}.
 */
public record UpdatePreferencesRequest(
        Boolean notificationsEnabled,
        Boolean matchAlertsEnabled,
        Boolean emailsEnabled
) {}
