package com.achadosedevolvidos.user.dto;

/**
 * Atualização parcial: qualquer campo omitido (null) permanece inalterado.
 * "name" quando enviado não pode ser vazio — validado no service, já que a
 * anotação @NotBlank barraria a atualização parcial (campo ausente = null é
 * um caso válido aqui, diferente de "obrigatório").
 */
public record UpdateProfileRequest(
        String name,
        String phone,
        String city,
        String avatarUrl
) {}
