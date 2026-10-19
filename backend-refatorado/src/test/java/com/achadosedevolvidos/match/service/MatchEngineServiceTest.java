package com.achadosedevolvidos.match.service;

import com.achadosedevolvidos.item.model.Item;
import com.achadosedevolvidos.match.dto.MatchCandidate;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

class MatchEngineServiceTest {

    private final MatchEngineService engine = new MatchEngineService();

    private static final UUID CATEGORY_ELETRONICOS = UUID.randomUUID();
    private static final UUID CATEGORY_DOCUMENTOS = UUID.randomUUID();

    @Test
    void deveDarScoreAltoParaItensProximosNoTempoNoEspacoEComTituloParecido() {
        MatchCandidate perdido = candidato(Item.ItemType.PERDIDO, CATEGORY_ELETRONICOS,
                -23.5505, -46.6333, LocalDateTime.of(2026, 1, 10, 14, 0), "Carteira preta de couro");

        MatchCandidate encontrado = candidato(Item.ItemType.ENCONTRADO, CATEGORY_ELETRONICOS,
                -23.5510, -46.6340, LocalDateTime.of(2026, 1, 10, 18, 0), "Carteira preta achada na praça");

        double score = engine.calculateMatchScore(perdido, encontrado);

        assertThat(score).isGreaterThanOrEqualTo(80.0);
    }

    @Test
    void deveDarScoreZeroParaItensDoMesmoTipo() {
        MatchCandidate perdido1 = candidato(Item.ItemType.PERDIDO, CATEGORY_ELETRONICOS,
                -23.5505, -46.6333, LocalDateTime.now(), "Chaveiro");
        MatchCandidate perdido2 = candidato(Item.ItemType.PERDIDO, CATEGORY_ELETRONICOS,
                -23.5505, -46.6333, LocalDateTime.now(), "Chaveiro");

        assertThat(engine.calculateMatchScore(perdido1, perdido2)).isZero();
    }

    @Test
    void deveDarScoreZeroParaCategoriasDiferentes() {
        MatchCandidate perdido = candidato(Item.ItemType.PERDIDO, CATEGORY_ELETRONICOS,
                -23.5505, -46.6333, LocalDateTime.now(), "Carteira");
        MatchCandidate encontrado = candidato(Item.ItemType.ENCONTRADO, CATEGORY_DOCUMENTOS,
                -23.5505, -46.6333, LocalDateTime.now(), "Carteira");

        assertThat(engine.calculateMatchScore(perdido, encontrado)).isZero();
    }

    @Test
    void deveDarScoreBaixoParaItensDistantesNoTempoENoEspaco() {
        MatchCandidate perdido = candidato(Item.ItemType.PERDIDO, CATEGORY_ELETRONICOS,
                -23.5505, -46.6333, LocalDateTime.of(2026, 1, 1, 10, 0), "Mochila azul");

        MatchCandidate encontrado = candidato(Item.ItemType.ENCONTRADO, CATEGORY_ELETRONICOS,
                -22.9068, -43.1729, LocalDateTime.of(2026, 3, 1, 10, 0), "Sacola vermelha"); // Rio de Janeiro

        double score = engine.calculateMatchScore(perdido, encontrado);

        assertThat(score).isEqualTo(20.0); // só o ponto de categoria
    }

    @Test
    void naoDeveLancarExcecaoQuandoCoordenadasOuDataForemNulas() {
        MatchCandidate perdidoSemCoordenadas = new MatchCandidate(
                UUID.randomUUID(), Item.ItemType.PERDIDO, CATEGORY_ELETRONICOS,
                null, null, null, "Carteira preta"
        );
        MatchCandidate encontrado = candidato(Item.ItemType.ENCONTRADO, CATEGORY_ELETRONICOS,
                -23.5505, -46.6333, LocalDateTime.now(), "Carteira preta achada");

        double score = engine.calculateMatchScore(perdidoSemCoordenadas, encontrado);

        // Sem coordenadas/data pra comparar, só os pontos de categoria (20) e
        // título em comum (15) entram na conta — nada de NullPointerException.
        assertThat(score).isEqualTo(35.0);
    }

    private MatchCandidate candidato(
            Item.ItemType type, UUID categoryId, double lat, double lng, LocalDateTime eventDate, String title
    ) {
        return new MatchCandidate(UUID.randomUUID(), type, categoryId, lat, lng, eventDate, title);
    }
}
