package com.achadosedevolvidos.user.repository;

import com.achadosedevolvidos.user.model.UserPreferences;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UserPreferencesRepository extends JpaRepository<UserPreferences, UUID> {

    Optional<UserPreferences> findByUserId(UUID userId);
}
