package com.achadosedevolvidos.item.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;
import java.util.UUID;

public record ItemResponse(
        UUID id,
        String imagemPrincipal,
        String nome,
        String status,
        String categoria,

        @JsonProperty("icon_url")
        String iconUrl,

        // Descrição principal e obrigatória.
        String descricao,

        // Características específicas e opcionais.
        String caracteristicasEspecificas,

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