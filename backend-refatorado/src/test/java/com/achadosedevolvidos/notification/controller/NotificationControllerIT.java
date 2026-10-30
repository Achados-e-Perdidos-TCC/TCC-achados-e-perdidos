package com.achadosedevolvidos.notification.controller;

import com.achadosedevolvidos.item.dto.CreateItemRequest;
import com.achadosedevolvidos.item.dto.ItemResponse;
import com.achadosedevolvidos.item.dto.UpdateItemStatusRequest;
import com.achadosedevolvidos.item.model.Item;
import com.achadosedevolvidos.notification.dto.NotificationResponse;
import com.achadosedevolvidos.support.IntegrationTestSupport;
import com.achadosedevolvidos.user.dto.UpdatePreferencesRequest;
import com.achadosedevolvidos.user.dto.UpdateProfileRequest;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Cobre tanto os endpoints REST de notificação quanto os dois gatilhos
 * assíncronos que as criam (troca de status de item e atualização de
 * perfil) — padrão {@code @Async} + {@code AFTER_COMMIT}.
 *
 * <p>Usa a categoria "Animais de Estimação" (fixa, semeada pelo Flyway) com
 * exclusividade nesta classe, para evitar concorrência com itens de outras
 * classes de teste na mesma categoria.</p>
 */
class NotificationControllerIT extends IntegrationTestSupport {

    private static final UUID CATEGORIA_ANIMAIS = UUID.fromString("55555555-5555-5555-5555-555555555555");

    @Test
    void sunnyDay_listaVaziaParaUsuarioSemNotificacoes() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Sem Notificacoes");

        mockMvc.perform(get("/api/v1/notifications")
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void rainyDay_deveRecusarListagemSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/v1/notifications"))
                .andExpect(status().isForbidden());
    }

    @Test
    void sunnyDay_atualizarPerfilDeveCriarNotificacaoDePerfilAtualizado() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Atualiza Perfil Notif");

        mockMvc.perform(patch("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateProfileRequest(null, "51988887777", null, null))))
                .andExpect(status().isOk());

        await().atMost(Duration.ofSeconds(10)).untilAsserted(() -> {
            List<NotificationResponse> notificacoes = listarNotificacoes(user);
            assertThat(notificacoes)
                    .anyMatch(n -> n.type() == com.achadosedevolvidos.notification.model.Notification.NotificationType.PROFILE_UPDATED);
        });
    }

    @Test
    void rainyDay_preferenciaDesligadaNaoDeveCriarNotificacaoDePerfil() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Preferencia Notif Desligada");

        mockMvc.perform(patch("/api/v1/users/me/preferences")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdatePreferencesRequest(false, null, null))))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateProfileRequest("Novo Nome", null, null, null))))
                .andExpect(status().isOk());

        await().pollDelay(Duration.ofSeconds(2)).atMost(Duration.ofSeconds(5)).untilAsserted(() -> {
            List<NotificationResponse> notificacoes = listarNotificacoes(user);
            assertThat(notificacoes).isEmpty();
        });
    }

    @Test
    void sunnyDay_trocarStatusDoItemDeveCriarNotificacaoDeItemAtualizado() throws Exception {
        AuthenticatedTestUser dono = registerAndAuthenticate("Dono Item Notif");

        ItemResponse item = criarItem(dono, new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ANIMAIS, "Item perdido notif " + UUID.randomUUID(),
                "Descricao completa", "Descricao curta", null, -23.55, -46.63,
                LocalDateTime.now().minusHours(1), null
        ));

        mockMvc.perform(patch("/api/v1/items/" + item.id() + "/status")
                        .header("Authorization", dono.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateItemStatusRequest(Item.ItemStatus.RESOLVIDO))))
                .andExpect(status().isOk());

        await().atMost(Duration.ofSeconds(10)).untilAsserted(() -> {
            List<NotificationResponse> notificacoes = listarNotificacoes(dono);
            assertThat(notificacoes)
                    .anyMatch(n -> n.type() == com.achadosedevolvidos.notification.model.Notification.NotificationType.ITEM_UPDATED);
        });
    }

    @Test
    void sunnyDay_deveMarcarUmaNotificacaoComoLida() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Marca Uma Lida");

        mockMvc.perform(patch("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateProfileRequest(null, "51999990000", null, null))))
                .andExpect(status().isOk());

        await().atMost(Duration.ofSeconds(10)).untilAsserted(() ->
                assertThat(listarNotificacoes(user)).isNotEmpty()
        );
        UUID notificacaoId = listarNotificacoes(user).get(0).id();

        mockMvc.perform(patch("/api/v1/notifications/" + notificacaoId + "/read")
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read").value(true));
    }

    @Test
    void rainyDay_naoPodeMarcarNotificacaoDeOutroUsuarioComoLida() throws Exception {
        AuthenticatedTestUser dono = registerAndAuthenticate("Dono Notificacao");
        AuthenticatedTestUser outro = registerAndAuthenticate("Outro Usuario Notif");

        mockMvc.perform(patch("/api/v1/users/me")
                        .header("Authorization", dono.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateProfileRequest(null, "51999991111", null, null))))
                .andExpect(status().isOk());

        await().atMost(Duration.ofSeconds(10)).untilAsserted(() ->
                assertThat(listarNotificacoes(dono)).isNotEmpty()
        );
        UUID notificacaoId = listarNotificacoes(dono).get(0).id();

        mockMvc.perform(patch("/api/v1/notifications/" + notificacaoId + "/read")
                        .header("Authorization", outro.authorizationHeader()))
                .andExpect(status().isForbidden());
    }

    @Test
    void sunnyDay_deveMarcarTodasComoLidas() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Marca Todas Lidas");

        mockMvc.perform(patch("/api/v1/users/me")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(new UpdateProfileRequest(null, "51999992222", null, null))))
                .andExpect(status().isOk());

        await().atMost(Duration.ofSeconds(10)).untilAsserted(() ->
                assertThat(listarNotificacoes(user)).isNotEmpty()
        );

        mockMvc.perform(patch("/api/v1/notifications/read-all")
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").exists());

        assertThat(listarNotificacoes(user)).allMatch(NotificationResponse::read);
    }

    private ItemResponse criarItem(AuthenticatedTestUser autor, CreateItemRequest request) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", autor.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();
        return objectMapper.readValue(result.getResponse().getContentAsString(), ItemResponse.class);
    }

    private List<NotificationResponse> listarNotificacoes(AuthenticatedTestUser user) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/v1/notifications")
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readValue(
                result.getResponse().getContentAsString(),
                objectMapper.getTypeFactory().constructCollectionType(List.class, NotificationResponse.class)
        );
    }
}
