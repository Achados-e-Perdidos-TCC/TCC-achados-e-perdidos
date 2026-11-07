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
 * <p>Em {@link LocalizacaoResponse}, "endereco" é o bairro ({@code Item.bairro}
 * — o nível mais fino que o formulário de cadastro coleta), "cidade" e
 * "estado" (sigla da UF) vêm de colunas estruturadas próprias. "complemento"
 * ainda não é coletado por nenhum formulário — reservado pra uma eventual
 * linha de endereço livre, por enquanto sempre {@code null}.</p>
 *
 * <p>"emailResponsavel" só vem preenchido no detalhe público de um item
 * específico ({@code GET /items/{id}}, via {@code ItemMapper.toResponse}
 * com o parâmetro de e-mail) — nunca em listagens (busca, "meus objetos"),
 * pra não virar um vetor de coleta em massa de e-mail de usuário. Além
 * disso, só aparece se o dono tiver {@code showEmailOnItems} habilitado nas
 * próprias preferências (default ligado — ver UserPreferences).</p>
 *
 * <p>"descricao" é o resumo curto ({@code Item.shortDescription}, até 100
 * caracteres) — o que sempre foi, usado nos cards de busca e como destaque
 * de características específicas no detalhe. "descricaoCompleta" é o texto
 * completo ({@code Item.description}), campo adicional pra tela de detalhe
 * mostrar o relato inteiro sem reaproveitar (e quebrar) o significado de
 * "descricao".</p>
 */
public record ItemResponse(
        UUID id,
        String imagemPrincipal,
        String nome,
        String status,
        String categoria,
        @JsonProperty("icon_url") String iconUrl,
        String descricao,
        String descricaoCompleta,
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