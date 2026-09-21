package com.achadosedevolvidos.user.dto;

import com.achadosedevolvidos.user.model.User;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserProfileResponse(
        UUID id,
        String name,
        String email,
        String phone,
        String city,
        String avatarUrl,
        User.Role role,
        LocalDateTime createdAt,
        PreferencesResponse preferences
) {}
