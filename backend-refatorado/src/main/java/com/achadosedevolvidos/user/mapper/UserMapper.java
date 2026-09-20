package com.achadosedevolvidos.user.mapper;

import com.achadosedevolvidos.user.dto.PreferencesResponse;
import com.achadosedevolvidos.user.dto.UserProfileResponse;
import com.achadosedevolvidos.user.model.User;
import com.achadosedevolvidos.user.model.UserPreferences;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    /**
     * preferences pode ser null (usuário ainda não tem linha em
     * user_preferences) — nesse caso os valores padrão (tudo habilitado) são
     * usados, sem precisar criar a linha só para exibir o GET.
     */
    public UserProfileResponse toResponse(User user, UserPreferences preferences) {
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getCity(),
                user.getAvatarUrl(),
                user.getRole(),
                user.getCreatedAt(),
                toPreferencesResponse(preferences)
        );
    }

    public PreferencesResponse toPreferencesResponse(UserPreferences preferences) {
        if (preferences == null) {
            return new PreferencesResponse(true, true, true);
        }
        return new PreferencesResponse(
                preferences.isNotificationsEnabled(),
                preferences.isMatchAlertsEnabled(),
                preferences.isEmailsEnabled()
        );
    }
}
