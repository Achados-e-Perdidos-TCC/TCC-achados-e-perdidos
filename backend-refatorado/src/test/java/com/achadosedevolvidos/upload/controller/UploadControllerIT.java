package com.achadosedevolvidos.upload.controller;

import com.achadosedevolvidos.support.IntegrationTestSupport;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.charset.StandardCharsets;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UploadControllerIT extends IntegrationTestSupport {

    @Test
    void sunnyDay_deveSalvarImagemEDevolverUrlAcessivelPublicamente() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Upload Valido");
        MockMultipartFile file = new MockMultipartFile("file", "foto.png", "image/png", "conteudo-fake-de-imagem".getBytes());

        var result = mockMvc.perform(multipart("/api/v1/uploads/images")
                        .file(file)
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.url").exists())
                .andReturn();

        String url = objectMapper.readTree(result.getResponse().getContentAsString(StandardCharsets.UTF_8)).get("url").asText();

        // A URL devolvida é servida publicamente (sem Authorization), já que
        // aparece embutida em respostas públicas de busca/detalhe de item.
        mockMvc.perform(get(url))
                .andExpect(status().isOk());
    }

    @Test
    void rainyDay_deveRecusarUploadSemAutenticacao() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "foto.png", "image/png", "conteudo-fake-de-imagem".getBytes());

        mockMvc.perform(multipart("/api/v1/uploads/images").file(file))
                .andExpect(status().isForbidden());
    }

    @Test
    void rainyDay_deveRecusarTipoDeArquivoNaoSuportado() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Upload Tipo Invalido");
        MockMultipartFile file = new MockMultipartFile("file", "script.js", "application/javascript", "alert(1)".getBytes());

        mockMvc.perform(multipart("/api/v1/uploads/images")
                        .file(file)
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isBadRequest());
    }

    @Test
    void rainyDay_deveRecusarArquivoVazio() throws Exception {
        AuthenticatedTestUser user = registerAndAuthenticate("Upload Vazio");
        MockMultipartFile file = new MockMultipartFile("file", "vazio.png", "image/png", new byte[0]);

        mockMvc.perform(multipart("/api/v1/uploads/images")
                        .file(file)
                        .header("Authorization", user.authorizationHeader()))
                .andExpect(status().isBadRequest());
    }
}
