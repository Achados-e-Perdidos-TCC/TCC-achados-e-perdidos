package com.achadosedevolvidos.user.service;

import com.achadosedevolvidos.auth.dto.MessageResponse;
import com.achadosedevolvidos.user.dto.ChangePasswordRequest;
import com.achadosedevolvidos.user.dto.UpdateProfileRequest;
import com.achadosedevolvidos.user.dto.UserProfileResponse;

import java.util.UUID;

public interface UserService {

    UserProfileResponse getProfile(UUID currentUserId);

    UserProfileResponse updateProfile(UUID currentUserId, UpdateProfileRequest request);

    MessageResponse changePassword(UUID currentUserId, ChangePasswordRequest request);
}
