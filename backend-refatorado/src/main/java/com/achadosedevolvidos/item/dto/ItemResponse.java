package com.achadosedevolvidos.item.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

/**
 * Formato acordado com o time de frontend para os dados exibidos tanto no card
 * de busca quanto na tela de detalhe do item (mesma estrutura para os dois).
 *
 * <p>"status" aqui é o nosso {@code Item.ItemType} (PERDIDO/ENCONTRADO) — o
 * frontend não pediu o status de workflow real ({@code Item.ItemStatus}:
 * ANALISANDO/PROCURANDO/RESOLVIDO/INATIVO), então ele não aparece
 * nesta estrutura.</p>
 *
 * <p>"cidade"/"estado"/"complemento" de {@link LocalizacaoResponse} ainda não
 * existem como colunas separadas no banco — hoje só há um campo de texto livre
 * ({@code locationText}), mapeado para "endereco"; os outros três ficam
 * {@code null} até o modelo de dados (e o formulário de cadastro) mudar para
 * suportar endereço estruturado.</p>
 *
 * <p>"emailResponsavel" só vem preenchido no detalhe público de um item
 * específico ({@code GET /items/{id}}, via {@code ItemMapper.toResponse}
 * com o parâmetro de e-mail) — nunca em listagens (busca, "meus objetos"),
 * pra não virar um vetor de coleta em massa de e-mail de usuário. Além
 * disso, só aparece se o dono tiver {@code showEmailOnItems} habilitado nas
 * próprias preferências (default ligado — ver UserPreferences).</p>
 */
public record ItemResponse(
        UUID id,
        String imagemPrincipal,
        String nome,
        String status,
        String categoria,
        @JsonProperty("icon_url") String iconUrl,
        String descricao,
        List<String> imagensSecundarias,
        LocalizacaoResponse localizacao,
        DataEventoResponse data,
        String emailResponsavel
) {

    public record LocalizacaoResponse(
            String endereco,
            String cidade,
            String estado,
            Double latitude,
            Double longitude,
            String complemento
    ) {}

    public record DataEventoResponse(
            String data,
            String hora
    ) {}
}
