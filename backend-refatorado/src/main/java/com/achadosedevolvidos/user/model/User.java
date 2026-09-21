package com.achadosedevolvidos.user.model;

import com.achadosedevolvidos.shared.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Entidade central de autenticação. Único mecanismo de login é o Bearer JWT
 * (e-mail/senha) — o login via Google (OAuth2) foi removido do produto.
 */
@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class User extends BaseEntity implements UserDetails, AuthenticatedUser {

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private String phone;

    private String city;

    @Column(name = "avatar_url")
    private String avatarUrl;

    /**
     * DELETE /users/me é soft delete: em vez de apagar a linha, marca
     * active=false. Isso desativa o login via {@link #isEnabled()}, checado
     * pelo AuthenticationManager em /auth/login e pelo JwtAuthenticationFilter
     * (para um access token já emitido parar de valer). Ver também
     * UserServiceImpl.deleteAccount (revoga refresh tokens e marca os itens
     * do usuário como INATIVO).
     */
    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;

    // --- Implementação de UserDetails (usada pelo fluxo de Bearer JWT) ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return active;
    }

    public enum Role { USER, ADMIN }
}
