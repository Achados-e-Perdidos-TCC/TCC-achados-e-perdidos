package com.achadosedevolvidos.auth.controller;

import com.achadosedevolvidos.support.IntegrationTestSupport;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Cobre a defesa por E-MAIL (AuthService.login), não a por IP
 * (LoginRateLimitFilter): o bucket de IP é compartilhado pelo mesmo contexto
 * Spring entre TODAS as classes de teste de integração (ver
 * IntegrationTestSupport) e esgotá-lo de propósito aqui envenenaria os logins
 * de outras classes pro resto da execução do `mvn verify`. O bucket por
 * e-mail, por sua vez, é isolado por natureza — cada teste usa um e-mail
 * próprio (via registerAndAuthenticate), então não há esse risco. A lógica
 * do bucket de IP em si já é coberta por LoginRateLimiterTest (unitário).
 */
class LoginRateLimitIT extends IntegrationTestSupport {

    private static final int LIMITE_PADRAO_POR_EMAIL = 5;

    @Test
    void rainyDay_deveBloquearLoginAposExcederTentativasFalhasParaOMesmoEmail() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Rate Limit Email");
        String email = user.user().getEmail();

        for (int i = 0; i < LIMITE_PADRAO_POR_EMAIL; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"email\":\"" + email + "\",\"password\":\"senhaErrada\"}"))
                    .andExpect(status().isUnauthorized());
        }

        // A conta está no limite agora — mesmo com a senha CERTA, a checagem
        // de rate limit roda antes de validar a senha (AuthService.login).
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"senha12345\"}"))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.status").value(429));
    }

    @Test
    void sunnyDay_loginBemSucedidoNaoContaParaOLimiteEResetaTentativasFalhas() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Rate Limit Sucesso Reseta");
        String email = user.user().getEmail();

        // Menos que o limite, depois login certo.
        for (int i = 0; i < LIMITE_PADRAO_POR_EMAIL - 1; i++) {
            mockMvc.perform(post("/api/v1/auth/login")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("{\"email\":\"" + email + "\",\"password\":\"senhaErrada\"}"))
                    .andExpect(status().isUnauthorized());
        }

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"senha12345\"}"))
                .andExpect(status().isOk());

        // Se o sucesso não tivesse resetado o contador, já estaríamos no
        // limite (LIMITE_PADRAO_POR_EMAIL - 1 falhas já consumidas) e esta
        // próxima falha sozinha bastaria pra bloquear — mas o bucket foi
        // resetado, então ainda sobra margem.
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"senhaErrada\"}"))
                .andExpect(status().isUnauthorized());
    }
}
