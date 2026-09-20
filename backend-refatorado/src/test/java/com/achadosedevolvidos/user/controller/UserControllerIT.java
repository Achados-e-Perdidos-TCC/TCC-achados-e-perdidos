package com.achadosedevolvidos.user.controller;

import com.achadosedevolvidos.item.dto.CreateItemRequest;
import com.achadosedevolvidos.item.dto.ItemResponse;
import com.achadosedevolvidos.item.model.Item;
import com.achadosedevolvidos.item.repository.ItemRepository;
import com.achadosedevolvidos.support.IntegrationTestSupport;
import com.achadosedevolvidos.user.dto.ChangePasswordRequest;
import com.achadosedevolvidos.user.dto.UpdatePreferencesRequest;
import com.achadosedevolvidos.user.dto.UpdateProfileRequest;
import com.achadosedevolvidos.user.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserControllerIT extends IntegrationTestSupport {

    private static final UUID CATEGORIA_ELETRONICOS = UUID.fromString("11111111-1111-1111-1111-111111111111");

    @Autowired
    private ItemRepository itemRepository;

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

    @Test
    void sunnyDay_deveRetornarPreferenciasPadraoAntesDeQualquerAtualizacao() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Preferencias Padrao");

        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preferences.notificationsEnabled").value(true))
                .andExpect(jsonPath("$.preferences.matchAlertsEnabled").value(true))
                .andExpect(jsonPath("$.preferences.emailsEnabled").value(true));
    }

    @Test
    void sunnyDay_deveAtualizarApenasAsPreferenciasEnviadas() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Atualiza Preferencias");

        UpdatePreferencesRequest primeiraAtualizacao = new UpdatePreferencesRequest(false, null, null);

        mockMvc.perform(patch("/api/v1/users/me/preferences")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(primeiraAtualizacao)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.notificationsEnabled").value(false))
                .andExpect(jsonPath("$.matchAlertsEnabled").value(true))
                .andExpect(jsonPath("$.emailsEnabled").value(true));

        UpdatePreferencesRequest segundaAtualizacao = new UpdatePreferencesRequest(null, false, false);

        mockMvc.perform(patch("/api/v1/users/me/preferences")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(segundaAtualizacao)))
                .andExpect(status().isOk())
                // Não enviado na segunda chamada: preservado da primeira.
                .andExpect(jsonPath("$.notificationsEnabled").value(false))
                .andExpect(jsonPath("$.matchAlertsEnabled").value(false))
                .andExpect(jsonPath("$.emailsEnabled").value(false));
    }

    @Test
    void rainyDay_deveRecusarAtualizacaoDePreferenciasSemAutenticacao() throws Exception {
        UpdatePreferencesRequest request = new UpdatePreferencesRequest(true, true, true);

        mockMvc.perform(patch("/api/v1/users/me/preferences")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void sunnyDay_deveDesativarContaBloquearLoginEMarcarItensComoInativos() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Exclusao De Conta");

        CreateItemRequest itemRequest = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, "Item do usuario que vai excluir a conta",
                "Descrição completa do item", "Descrição curta do item", null, -23.55, -46.63,
                LocalDateTime.now(), null
        );
        MvcResult createResult = mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(itemRequest)))
                .andExpect(status().isCreated())
                .andReturn();
        ItemResponse createdItem = objectMapper.readValue(
                createResult.getResponse().getContentAsString(StandardCharsets.UTF_8), ItemResponse.class
        );

        mockMvc.perform(delete("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());

        // Login com a senha correta não funciona mais: DaoAuthenticationProvider
        // lança DisabledException a partir de User.isEnabled()==false.
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + user.user().getEmail() + "\",\"password\":\"senha12345\"}"))
                .andExpect(status().isUnauthorized());

        // O access token já emitido antes da exclusão também para de valer:
        // JwtAuthenticationFilter agora checa userDetails.isEnabled().
        mockMvc.perform(get("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isForbidden());

        Item itemPersistido = itemRepository.findById(createdItem.id()).orElseThrow();
        assertThat(itemPersistido.getStatus()).isEqualTo(Item.ItemStatus.INATIVO);
    }

    @Test
    void rainyDay_deveRecusarExclusaoDeContaSemAutenticacao() throws Exception {
        mockMvc.perform(delete("/api/v1/users/me"))
                .andExpect(status().isForbidden());
    }
}
