package com.achadosedevolvidos.user.controller;

import com.achadosedevolvidos.auth.dto.MessageResponse;
import com.achadosedevolvidos.user.dto.ChangePasswordRequest;
import com.achadosedevolvidos.user.dto.UpdateProfileRequest;
import com.achadosedevolvidos.user.dto.UserProfileResponse;
import com.achadosedevolvidos.user.model.AuthenticatedUser;
import com.achadosedevolvidos.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/users/me")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal AuthenticatedUser currentUser) {
        return ResponseEntity.ok(userService.getProfile(currentUser.getId()));
    }

    @PatchMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(currentUser.getId(), request));
    }

    @PatchMapping("/password")
    public ResponseEntity<MessageResponse> changePassword(
            @AuthenticationPrincipal AuthenticatedUser currentUser,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        return ResponseEntity.ok(userService.changePassword(currentUser.getId(), request));
    }
}
