package com.achadosedevolvidos.item.controller;

import com.achadosedevolvidos.item.dto.CreateItemRequest;
import com.achadosedevolvidos.item.dto.ItemResponse;
import com.achadosedevolvidos.item.dto.UpdateItemRequest;
import com.achadosedevolvidos.item.dto.UpdateItemStatusRequest;
import com.achadosedevolvidos.item.model.Item;
import com.achadosedevolvidos.support.IntegrationTestSupport;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Integração de ponta a ponta de {@code ItemController}: criação, busca e
 * detalhe, incluindo a exigência de autenticação via {@code @AuthenticationPrincipal}
 * que este refactor corrigiu (ver ARQUITETURA.md, seção 4).
 */
class ItemControllerIT extends IntegrationTestSupport {

    private static final UUID CATEGORIA_ELETRONICOS = UUID.fromString("11111111-1111-1111-1111-111111111111");

    @Test
    void sunnyDay_deveCriarBuscarEConsultarItemAutenticado() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Dono do Item");
        String marcador = "Marcador-" + UUID.randomUUID();

        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, marcador + " carteira preta",
                "Perdida perto da entrada principal", "Carteira preta perdida", "Bloco A", -23.5505, -46.6333,
                LocalDateTime.now().minusHours(2), List.of("http://exemplo.com/foto1.png")
        );

        MvcResult createResult = mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value(marcador + " carteira preta"))
                .andExpect(jsonPath("$.status").value("PERDIDO"))
                .andExpect(jsonPath("$.descricao").value("Carteira preta perdida"))
                .andReturn();

        ItemResponse created = objectMapper.readValue(createResult.getResponse().getContentAsString(StandardCharsets.UTF_8), ItemResponse.class);

        mockMvc.perform(get("/api/v1/items/" + created.id()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(created.id().toString()));

        mockMvc.perform(get("/api/v1/items/search")
                        .param("type", "PERDIDO")
                        .param("query", marcador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.id == '" + created.id() + "')]").exists());

        // Endpoint autenticado (não é o dono de nada além do próprio item, mas
        // qualquer usuário logado pode consultar matches de um item público).
        mockMvc.perform(get("/api/v1/items/" + created.id() + "/matches")
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void rainyDay_deveRecusarCriacaoSemAutenticacao() throws Exception {
        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, "Item sem dono",
                null, null, null, -23.55, -46.63, LocalDateTime.now(), null
        );

        mockMvc.perform(post("/api/v1/items")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                // Sem header Authorization nenhum: cai no anyRequest().authenticated()
                // e é barrada pelo Http403ForbiddenEntryPoint padrão (nenhum mecanismo
                // de login baseado em sessão/redirect está configurado — só Bearer JWT).
                .andExpect(status().isForbidden());
    }

    @Test
    void rainyDay_deveRecusarConsultaDeMatchesSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/v1/items/" + UUID.randomUUID() + "/matches"))
                .andExpect(status().isForbidden());
    }

    @Test
    void rainyDay_deveRecusarCriacaoComCategoriaInexistente() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Categoria Invalida");

        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, UUID.randomUUID(), "Item com categoria fantasma",
                null, null, null, -23.55, -46.63, LocalDateTime.now(), null
        );

        mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void sunnyDay_deveAceitarDescricaoCurtaComExatamente100Caracteres() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Descricao Curta No Limite");
        String descricaoCurtaNoLimite = "x".repeat(100);

        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, "Item com descrição curta no limite",
                "Descrição completa do item", descricaoCurtaNoLimite, null, -23.55, -46.63, LocalDateTime.now(), null
        );

        mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.descricao").value(descricaoCurtaNoLimite));
    }

    @Test
    void rainyDay_deveRecusarCriacaoSemDescricao() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Sem Descricao");

        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, "Item sem descrição",
                null, "Descrição curta válida", null, -23.55, -46.63, LocalDateTime.now(), null
        );

        mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rainyDay_deveRecusarCriacaoComDescricaoContendoApenasEspacosEmBranco() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Descricao So Espacos");

        // Usuário aperta a barra de espaço e salva: sem @NotBlank isso passaria
        // como se fosse uma descrição preenchida, já que não é null nem "".
        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, "Item com descrição só de espaços",
                "     ", "Descrição curta válida", null, -23.55, -46.63, LocalDateTime.now(), null
        );

        mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rainyDay_deveRecusarCriacaoSemDescricaoCurta() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Sem Descricao Curta");

        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, "Item sem descrição curta",
                "Descrição completa do item", null, null, -23.55, -46.63, LocalDateTime.now(), null
        );

        mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rainyDay_deveRecusarCriacaoComDescricaoCurtaMaiorQue100Caracteres() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Descricao Curta Longa");
        String descricaoCurtaInvalida = "x".repeat(101);

        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, "Item com descrição curta longa demais",
                "Descrição completa do item", descricaoCurtaInvalida, null, -23.55, -46.63, LocalDateTime.now(), null
        );

        mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rainyDay_deveContarEspacosEmBrancoComoCaracteresNaDescricaoCurta() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Espacos Sao Caracteres");
        // 13 caracteres de texto + 90 espaços em branco = 103 caracteres.
        // Se os espaços não fossem contados (ex.: por um trim antes da validação),
        // esta descrição passaria como se tivesse só 13 caracteres.
        String descricaoCurtaComEspacos = "Chave perdida" + " ".repeat(90);

        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, "Item com espaços em branco na descrição curta",
                "Descrição completa do item perdido", descricaoCurtaComEspacos, null, -23.55, -46.63, LocalDateTime.now(), null
        );

        mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rainyDay_deveRecusarCriacaoComPayloadInvalido() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Payload Invalido");

        // type e categoryId ausentes, título em branco, data no futuro.
        String payloadInvalido = """
                {
                  "title": "",
                  "latitude": -23.55,
                  "longitude": -46.63,
                  "eventDate": "2099-01-01T00:00:00"
                }
                """;

        mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payloadInvalido))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rainyDay_deveRetornar404ParaItemInexistente() throws Exception {
        mockMvc.perform(get("/api/v1/items/" + UUID.randomUUID()))
                .andExpect(status().isNotFound());
    }

    @Test
    void rainyDay_deveIgnorarTokenInvalidoERecusarComoAnonimo() throws Exception {
        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, "Item com token quebrado",
                null, null, null, -23.55, -46.63, LocalDateTime.now(), null
        );

        mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", "Bearer isto-nao-eh-um-jwt")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void sunnyDay_buscaSemFiltrosNaoQuebra() throws Exception {
        mockMvc.perform(get("/api/v1/items/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void sunnyDay_buscaComLocationTextEIntervaloDeDatasFiltraCorretamente() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Filtro Data e Local");
        String marcador = "Marcador-" + UUID.randomUUID();
        LocalDateTime ontem = LocalDateTime.now().minusDays(1);

        CreateItemRequest request = new CreateItemRequest(
                Item.ItemType.PERDIDO, CATEGORIA_ELETRONICOS, marcador + " chaveiro",
                "Perdido no centro", "Chaveiro perdido", "Praca Central, Bloco A", -23.5505, -46.6333,
                ontem, null
        );

        MvcResult createResult = mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        ItemResponse created = objectMapper.readValue(createResult.getResponse().getContentAsString(StandardCharsets.UTF_8), ItemResponse.class);

        mockMvc.perform(get("/api/v1/items/search")
                        .param("locationText", "Praca Central")
                        .param("dateFrom", ontem.toLocalDate().minusDays(1).toString())
                        .param("dateTo", ontem.toLocalDate().plusDays(1).toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.id == '" + created.id() + "')]").exists());

        mockMvc.perform(get("/api/v1/items/search")
                        .param("locationText", "Praca Central")
                        .param("dateFrom", ontem.toLocalDate().plusDays(5).toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.id == '" + created.id() + "')]").doesNotExist());
    }

    // ---------- GET /items/me ----------

    @Test
    void rainyDay_deveRecusarMeusObjetosSemAutenticacao() throws Exception {
        mockMvc.perform(get("/api/v1/items/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    void sunnyDay_deveListarApenasOsProprioObjetosEFiltrarPorTypeOuStatus() throws Exception {
        AuthenticatedTestUser dono = registerAndAuthenticate("Dono Meus Objetos");
        AuthenticatedTestUser outraPessoa = registerAndAuthenticate("Outra Pessoa Meus Objetos");
        String marcador = "Marcador-" + UUID.randomUUID();

        ItemResponse perdido = criarItem(dono, Item.ItemType.PERDIDO, marcador + " perdido");
        ItemResponse encontrado = criarItem(dono, Item.ItemType.ENCONTRADO, marcador + " encontrado");
        criarItem(outraPessoa, Item.ItemType.PERDIDO, marcador + " de outra pessoa");

        // Sem filtro: só os itens do próprio dono, não o da outra pessoa.
        mockMvc.perform(get("/api/v1/items/me")
                        .header("Authorization", dono.authorizationHeader()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.id == '" + perdido.id() + "')]").exists())
                .andExpect(jsonPath("$.content[?(@.id == '" + encontrado.id() + "')]").exists())
                .andExpect(jsonPath("$.content[?(@.nome == '" + marcador + " de outra pessoa')]").doesNotExist());

        // Filtro combinado por type (PERDIDO).
        mockMvc.perform(get("/api/v1/items/me")
                        .header("Authorization", dono.authorizationHeader())
                        .param("status", "PERDIDO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.id == '" + perdido.id() + "')]").exists())
                .andExpect(jsonPath("$.content[?(@.id == '" + encontrado.id() + "')]").doesNotExist());

        // Filtro combinado por status real (ANALISANDO — valor default na criação).
        mockMvc.perform(get("/api/v1/items/me")
                        .header("Authorization", dono.authorizationHeader())
                        .param("status", "ANALISANDO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.id == '" + perdido.id() + "')]").exists())
                .andExpect(jsonPath("$.content[?(@.id == '" + encontrado.id() + "')]").exists());
    }

    @Test
    void rainyDay_deveRecusarFiltroDeStatusInvalidoEmMeusObjetos() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Filtro Status Invalido");

        mockMvc.perform(get("/api/v1/items/me")
                        .header("Authorization", user.authorizationHeader())
                        .param("status", "ISSO_NAO_EXISTE"))
                .andExpect(status().isBadRequest());
    }

    // ---------- PATCH /items/{id} ----------

    @Test
    void sunnyDay_donoDeveEditarApenasOsCamposEnviados() throws Exception {
        AuthenticatedTestUser dono = registerAndAuthenticate("Dono Edicao");
        ItemResponse item = criarItem(dono, Item.ItemType.PERDIDO, "Titulo original");

        UpdateItemRequest request = new UpdateItemRequest(null, "Titulo atualizado", null, null, null, null, null, null, null);

        mockMvc.perform(patch("/api/v1/items/" + item.id())
                        .header("Authorization", dono.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Titulo atualizado"))
                // Não enviado: preservado.
                .andExpect(jsonPath("$.descricao").value(item.descricao()));
    }

    @Test
    void rainyDay_naoDonoNaoPodeEditarItem() throws Exception {
        AuthenticatedTestUser dono = registerAndAuthenticate("Dono Nao Pode Editar");
        AuthenticatedTestUser outraPessoa = registerAndAuthenticate("Intruso Edicao");
        ItemResponse item = criarItem(dono, Item.ItemType.PERDIDO, "Item de outro dono");

        UpdateItemRequest request = new UpdateItemRequest(null, "Tentativa de sequestro", null, null, null, null, null, null, null);

        mockMvc.perform(patch("/api/v1/items/" + item.id())
                        .header("Authorization", outraPessoa.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void rainyDay_deveRecusarEdicaoSemAutenticacao() throws Exception {
        UpdateItemRequest request = new UpdateItemRequest(null, "Qualquer coisa", null, null, null, null, null, null, null);

        mockMvc.perform(patch("/api/v1/items/" + UUID.randomUUID())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    // ---------- DELETE /items/{id} ----------

    @Test
    void sunnyDay_donoDeveExcluirItemQueDesaparecerDaBuscaEDoDetalheMasContinuarEmMeusObjetos() throws Exception {
        AuthenticatedTestUser dono = registerAndAuthenticate("Dono Exclusao");
        String marcador = "Marcador-" + UUID.randomUUID();
        ItemResponse item = criarItem(dono, Item.ItemType.PERDIDO, marcador + " item a excluir");

        mockMvc.perform(delete("/api/v1/items/" + item.id())
                        .header("Authorization", dono.authorizationHeader()))
                .andExpect(status().isNoContent());

        // Some do detalhe público...
        mockMvc.perform(get("/api/v1/items/" + item.id()))
                .andExpect(status().isNotFound());

        // ...e da busca pública...
        mockMvc.perform(get("/api/v1/items/search").param("query", marcador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.id == '" + item.id() + "')]").doesNotExist());

        // ...mas continua no histórico do próprio dono, agora como INATIVO.
        mockMvc.perform(get("/api/v1/items/me")
                        .header("Authorization", dono.authorizationHeader())
                        .param("status", "INATIVO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.id == '" + item.id() + "')]").exists());
    }

    @Test
    void rainyDay_naoDonoNaoPodeExcluirItem() throws Exception {
        AuthenticatedTestUser dono = registerAndAuthenticate("Dono Protegido Exclusao");
        AuthenticatedTestUser outraPessoa = registerAndAuthenticate("Intruso Exclusao");
        ItemResponse item = criarItem(dono, Item.ItemType.PERDIDO, "Item protegido de exclusao");

        mockMvc.perform(delete("/api/v1/items/" + item.id())
                        .header("Authorization", outraPessoa.authorizationHeader()))
                .andExpect(status().isForbidden());
    }

    // ---------- PATCH /items/{id}/status ----------

    @Test
    void sunnyDay_donoDeveMarcarItemComoResolvido() throws Exception {
        // "status" no ItemResponse é o nosso "type" (PERDIDO/ENCONTRADO) — o
        // status real de workflow não aparece nessa estrutura (ver ItemMapper),
        // então a forma de confirmar a mudança é via o filtro combinado de
        // /items/me, não lendo o corpo da resposta deste PATCH.
        AuthenticatedTestUser dono = registerAndAuthenticate("Dono Status");
        ItemResponse item = criarItem(dono, Item.ItemType.ENCONTRADO, "Item a ser resolvido");

        UpdateItemStatusRequest request = new UpdateItemStatusRequest(Item.ItemStatus.RESOLVIDO);

        mockMvc.perform(patch("/api/v1/items/" + item.id() + "/status")
                        .header("Authorization", dono.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/v1/items/me")
                        .header("Authorization", dono.authorizationHeader())
                        .param("status", "RESOLVIDO"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.id == '" + item.id() + "')]").exists());
    }

    @Test
    void rainyDay_naoDonoNaoPodeAlterarStatus() throws Exception {
        AuthenticatedTestUser dono = registerAndAuthenticate("Dono Status Protegido");
        AuthenticatedTestUser outraPessoa = registerAndAuthenticate("Intruso Status");
        ItemResponse item = criarItem(dono, Item.ItemType.ENCONTRADO, "Item com status protegido");

        UpdateItemStatusRequest request = new UpdateItemStatusRequest(Item.ItemStatus.RESOLVIDO);

        mockMvc.perform(patch("/api/v1/items/" + item.id() + "/status")
                        .header("Authorization", outraPessoa.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void rainyDay_deveRecusarStatusInvalidoNoPayload() throws Exception {
        AuthenticatedTestUser dono = registerAndAuthenticate("Status Invalido Payload");
        ItemResponse item = criarItem(dono, Item.ItemType.ENCONTRADO, "Item com status invalido");

        String payloadInvalido = """
                { "status": "ISSO_NAO_EXISTE" }
                """;

        mockMvc.perform(patch("/api/v1/items/" + item.id() + "/status")
                        .header("Authorization", dono.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payloadInvalido))
                .andExpect(status().isBadRequest());
    }

    private ItemResponse criarItem(AuthenticatedTestUser user, Item.ItemType type, String title) throws Exception {
        CreateItemRequest request = new CreateItemRequest(
                type, CATEGORIA_ELETRONICOS, title,
                "Descrição completa", "Descrição curta", "Bloco A", -23.55, -46.63,
                LocalDateTime.now().minusHours(1), null
        );

        MvcResult result = mockMvc.perform(post("/api/v1/items")
                        .header("Authorization", user.authorizationHeader())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andReturn();

        return objectMapper.readValue(result.getResponse().getContentAsString(StandardCharsets.UTF_8), ItemResponse.class);
    }
}
