package com.achadosedevolvidos.user.model;

import com.achadosedevolvidos.shared.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "user_preferences")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class UserPreferences extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "notifications_enabled", nullable = false)
    @Builder.Default
    private boolean notificationsEnabled = true;

    @Column(name = "emails_enabled", nullable = false)
    @Builder.Default
    private boolean emailsEnabled = true;

    /**
     * Controla se o e-mail de cadastro aparece como "emailResponsavel" no
     * detalhe público de cada item do usuário (GET /items/{id}, sem
     * autenticação) — ver ItemServiceImpl.findById. Default true: quem
     * publica um item perdido/achado normalmente quer ser contatado: quem
     * se importa com privacidade desliga manualmente.
     */
    @Column(name = "show_email_on_items", nullable = false)
    @Builder.Default
    private boolean showEmailOnItems = true;
}
