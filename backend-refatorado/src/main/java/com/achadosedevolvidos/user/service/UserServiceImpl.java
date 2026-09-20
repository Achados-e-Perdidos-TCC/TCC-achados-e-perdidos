package com.achadosedevolvidos.user.service;

import com.achadosedevolvidos.auth.dto.MessageResponse;
import com.achadosedevolvidos.auth.repository.RefreshTokenRepository;
import com.achadosedevolvidos.item.model.Item;
import com.achadosedevolvidos.item.repository.ItemRepository;
import com.achadosedevolvidos.shared.exception.AppException;
import com.achadosedevolvidos.user.dto.ChangePasswordRequest;
import com.achadosedevolvidos.user.dto.PreferencesResponse;
import com.achadosedevolvidos.user.dto.UpdatePreferencesRequest;
import com.achadosedevolvidos.user.dto.UpdateProfileRequest;
import com.achadosedevolvidos.user.dto.UserProfileResponse;
import com.achadosedevolvidos.user.mapper.UserMapper;
import com.achadosedevolvidos.user.model.User;
import com.achadosedevolvidos.user.model.UserPreferences;
import com.achadosedevolvidos.user.repository.UserPreferencesRepository;
import com.achadosedevolvidos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserPreferencesRepository userPreferencesRepository;
    private final ItemRepository itemRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(UUID currentUserId) {
        User user = findUserOrThrow(currentUserId);
        UserPreferences preferences = userPreferencesRepository.findByUserId(currentUserId).orElse(null);
        return userMapper.toResponse(user, preferences);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(UUID currentUserId, UpdateProfileRequest request) {
        User user = findUserOrThrow(currentUserId);

        if (request.name() != null) {
            if (request.name().isBlank()) {
                throw new AppException("Nome não pode ser vazio", HttpStatus.BAD_REQUEST);
            }
            user.setName(request.name());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }
        if (request.city() != null) {
            user.setCity(request.city());
        }
        if (request.avatarUrl() != null) {
            user.setAvatarUrl(request.avatarUrl());
        }

        User saved = userRepository.save(user);
        UserPreferences preferences = userPreferencesRepository.findByUserId(currentUserId).orElse(null);
        return userMapper.toResponse(saved, preferences);
    }

    /**
     * Revoga todos os refresh tokens do usuário após a troca — mesma lógica de
     * segurança do reset de senha (AuthService.resetPassword): uma sessão
     * antiga/vazada não deve sobreviver a uma senha nova.
     */
    @Override
    @Transactional
    public MessageResponse changePassword(UUID currentUserId, ChangePasswordRequest request) {
        User user = findUserOrThrow(currentUserId);

        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new AppException("Senha atual incorreta", HttpStatus.UNAUTHORIZED);
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        refreshTokenRepository.revokeAllByUserId(user.getId());

        return new MessageResponse("Senha alterada com sucesso.");
    }

    /**
     * find-or-create: a maioria dos usuários nunca chamou este endpoint antes,
     * então a linha em user_preferences normalmente não existe ainda — é criada
     * na primeira alteração, já partindo dos valores padrão (tudo habilitado).
     */
    @Override
    @Transactional
    public PreferencesResponse updatePreferences(UUID currentUserId, UpdatePreferencesRequest request) {
        User user = findUserOrThrow(currentUserId);
        UserPreferences preferences = userPreferencesRepository.findByUserId(currentUserId)
                .orElseGet(() -> UserPreferences.builder().user(user).build());

        if (request.notificationsEnabled() != null) {
            preferences.setNotificationsEnabled(request.notificationsEnabled());
        }
        if (request.matchAlertsEnabled() != null) {
            preferences.setMatchAlertsEnabled(request.matchAlertsEnabled());
        }
        if (request.emailsEnabled() != null) {
            preferences.setEmailsEnabled(request.emailsEnabled());
        }

        return userMapper.toPreferencesResponse(userPreferencesRepository.save(preferences));
    }

    /**
     * Soft delete: marca active=false (bloqueia login futuro e, via
     * JwtAuthenticationFilter, também um access token já emitido), revoga
     * todos os refresh tokens (bloqueia /auth/refresh) e marca os itens do
     * próprio usuário como INATIVO em vez de apagar qualquer linha.
     */
    @Override
    @Transactional
    public MessageResponse deleteAccount(UUID currentUserId) {
        User user = findUserOrThrow(currentUserId);

        user.setActive(false);
        userRepository.save(user);

        refreshTokenRepository.revokeAllByUserId(currentUserId);
        itemRepository.updateStatusForAllByUserId(currentUserId, Item.ItemStatus.INATIVO);

        return new MessageResponse("Conta desativada com sucesso.");
    }

    private User findUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Usuário não encontrado", HttpStatus.UNAUTHORIZED));
    }
}
