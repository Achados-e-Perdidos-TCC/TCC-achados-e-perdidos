package com.achadosedevolvidos.user.dto;

public record PreferencesResponse(
        boolean notificationsEnabled,
        boolean emailsEnabled
) {}
