package com.achadosedevolvidos.item.mapper;

import com.achadosedevolvidos.item.dto.ItemResponse;
import com.achadosedevolvidos.item.dto.ItemResponse.DataEventoResponse;
import com.achadosedevolvidos.item.dto.ItemResponse.LocalizacaoResponse;
import com.achadosedevolvidos.item.model.Item;
import com.achadosedevolvidos.item.model.ItemImage;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

@Component
public class ItemMapper {

    private static final DateTimeFormatter HORA_FORMATTER =
            DateTimeFormatter.ofPattern("HH:mm");

    public ItemResponse toResponse(Item item) {
        return toResponse(item, null);
    }

    /**
     * emailResponsavel já vem resolvido por quem chama (ItemServiceImpl).
     * O Mapper não decide se o e-mail deve ou não aparecer,
     * apenas monta a resposta com o que foi passado.
     */
    public ItemResponse toResponse(Item item, String emailResponsavel) {

        List<String> imagens = item.getImages() == null
                ? List.of()
                : item.getImages().stream()
                        .sorted(Comparator.comparing(ItemImage::getDisplayOrder))
                        .map(ItemImage::getUrl)
                        .toList();

        String imagemPrincipal = imagens.isEmpty() ? null : imagens.get(0);

        // Recupera a localização armazenada no objeto.
        String locationText = item.getLocationText();

        String endereco = null;
        String cidade = null;
        String estado = null;

        if (locationText != null && !locationText.isBlank()) {

            String[] partes = locationText.split("\\s+-\\s+", 2);

            if (partes.length == 2) {
                estado = partes[1].trim();

                String bairroECidade = partes[0].trim();

                int ultimaVirgula = bairroECidade.lastIndexOf(',');

                if (ultimaVirgula >= 0) {
                    endereco = bairroECidade.substring(0, ultimaVirgula).trim();
                    cidade = bairroECidade.substring(ultimaVirgula + 1).trim();
                } else {
                    cidade = bairroECidade;
                }
            }
        }

        LocalizacaoResponse localizacao = new LocalizacaoResponse(
                endereco,
                cidade,
                estado,
                item.getLatitude(),
                item.getLongitude(),
                null
        );

        DataEventoResponse data = item.getEventDate() == null
                ? null
                : new DataEventoResponse(
                        item.getEventDate().toLocalDate().toString(),
                        item.getEventDate().toLocalTime().format(HORA_FORMATTER)
                );

        return new ItemResponse(
                item.getId(),
                imagemPrincipal,
                item.getTitle(),
                item.getType().name(),
                item.getCategory().getName(),
                item.getCategory().getIconUrl(),
                item.getShortDescription() != null && !item.getShortDescription().isBlank()
                        ? item.getShortDescription()
                        : item.getDescription(),
                imagens,
                localizacao,
                data,
                emailResponsavel
        );
    }
}