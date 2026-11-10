package com.achadosedevolvidos.config;

import com.achadosedevolvidos.support.IntegrationTestSupport;
import org.junit.jupiter.api.Test;
import org.springframework.test.context.TestPropertySource;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * {@code cors.allowed-origins} aceita padrão com wildcard (ver
 * {@code SecurityConfig.corsConfigurationSource}) — essencial pra deploys de
 * preview do Vercel, que geram uma URL com hash aleatório por deploy.
 */
@TestPropertySource(properties =
        "cors.allowed-origins=https://achados-e-devolvidos.vercel.app,https://achados-e-devolvidos-*.vercel.app")
class CorsConfigurationIT extends IntegrationTestSupport {

    @Test
    void sunnyDay_deveAceitarPreflightDeQualquerPreviewDoVercel() throws Exception {
        String origemPreview = "https://achados-e-devolvidos-n8ambj0rm-gabiavila08-8225.vercel.app";

        mockMvc.perform(options("/api/v1/categories")
                        .header("Origin", origemPreview)
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", origemPreview));
    }

    @Test
    void sunnyDay_deveAceitarPreflightDaOrigemFixaDeProducao() throws Exception {
        String origemProducao = "https://achados-e-devolvidos.vercel.app";

        mockMvc.perform(options("/api/v1/categories")
                        .header("Origin", origemProducao)
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", origemProducao));
    }

    @Test
    void rainyDay_deveRecusarPreflightDeOrigemForaDoPadrao() throws Exception {
        mockMvc.perform(options("/api/v1/categories")
                        .header("Origin", "https://site-nao-autorizado.com")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isForbidden());
    }
}
