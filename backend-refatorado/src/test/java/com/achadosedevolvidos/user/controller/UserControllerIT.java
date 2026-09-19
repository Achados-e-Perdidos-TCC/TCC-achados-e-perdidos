package com.achadosedevolvidos.user.controller;

import com.achadosedevolvidos.support.IntegrationTestSupport;
import com.achadosedevolvidos.user.dto.ChangePasswordRequest;
import com.achadosedevolvidos.user.dto.UpdateProfileRequest;
import com.achadosedevolvidos.user.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserControllerIT extends IntegrationTestSupport {

    @Test
    void sunnyDay_deveRetornarPerfilDoUsuarioLogado() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Perfil Proprio");

        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(user.user().getId().toString()))
                .andExpect(jsonPath("$.name").value(user.user().getName()))
                .andExpect(jsonPath("$.email").value(user.user().getEmail()))
                .andExpect(jsonPath("$.phone").doesNotExist())
                .andExpect(jsonPath("$.city").doesNotExist());
    }

    @Test
    void rainyDay_deveRecusarPerfilSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/v1/users/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    void sunnyDay_deveAtualizarApenasOsCamposEnviados() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Atualiza Perfil");
        String nomeOriginal = user.user().getName();

        UpdateProfileRequest request = new UpdateProfileRequest(null, "51999999999", "Porto Alegre", null);

        mockMvc.perform(patch("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value(nomeOriginal))
                .andExpect(jsonPath("$.phone").value("51999999999"))
                .andExpect(jsonPath("$.city").value("Porto Alegre"))
                .andExpect(jsonPath("$.avatarUrl").doesNotExist());

        UpdateProfileRequest segundaAtualizacao = new UpdateProfileRequest("Novo Nome", null, null, "http://exemplo.com/avatar.png");

        mockMvc.perform(patch("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(segundaAtualizacao)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Novo Nome"))
                // Não enviado na segunda chamada: preservado da primeira.
                .andExpect(jsonPath("$.phone").value("51999999999"))
                .andExpect(jsonPath("$.city").value("Porto Alegre"))
                .andExpect(jsonPath("$.avatarUrl").value("http://exemplo.com/avatar.png"));
    }

    @Test
    void rainyDay_deveRecusarNomeVazioNaAtualizacaoDePerfil() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Nome Vazio");

        UpdateProfileRequest request = new UpdateProfileRequest("   ", null, null, null);

        mockMvc.perform(patch("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void sunnyDay_deveTrocarSenhaERevogarSessoesAntigas() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Troca Senha");

        ChangePasswordRequest request = new ChangePasswordRequest("senha12345", "senhaNova123");

        mockMvc.perform(patch("/api/v1/users/me/password")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());

        // Login com a senha antiga não funciona mais.
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + user.user().getEmail() + "\",\"password\":\"senha12345\"}"))
                .andExpect(status().isUnauthorized());

        // Login com a senha nova funciona.
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + user.user().getEmail() + "\",\"password\":\"senhaNova123\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void rainyDay_deveRecusarTrocaDeSenhaComSenhaAtualIncorreta() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Senha Atual Errada");

        ChangePasswordRequest request = new ChangePasswordRequest("senhaErrada999", "senhaNova123");

        mockMvc.perform(patch("/api/v1/users/me/password")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rainyDay_deveRecusarTrocaDeSenhaComNovaSenhaCurta() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Senha Nova Curta");

        ChangePasswordRequest request = new ChangePasswordRequest("senha12345", "curta");

        mockMvc.perform(patch("/api/v1/users/me/password")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
