package com.achadosedevolvidos.user.service;

import com.achadosedevolvidos.auth.dto.MessageResponse;
import com.achadosedevolvidos.auth.repository.RefreshTokenRepository;
import com.achadosedevolvidos.shared.exception.AppException;
import com.achadosedevolvidos.user.dto.ChangePasswordRequest;
import com.achadosedevolvidos.user.dto.UpdateProfileRequest;
import com.achadosedevolvidos.user.dto.UserProfileResponse;
import com.achadosedevolvidos.user.mapper.UserMapper;
import com.achadosedevolvidos.user.model.User;
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
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(UUID currentUserId) {
        return userMapper.toResponse(findUserOrThrow(currentUserId));
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

        return userMapper.toResponse(userRepository.save(user));
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

    private User findUserOrThrow(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Usuário não encontrado", HttpStatus.UNAUTHORIZED));
    }
}
