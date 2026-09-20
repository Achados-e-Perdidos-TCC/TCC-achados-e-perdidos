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

    private static final DateTimeFormatter HORA_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public ItemResponse toResponse(Item item) {
        List<String> imagens = item.getImages() == null
                ? List.of()
                : item.getImages().stream()
                        .sorted(Comparator.comparing(ItemImage::getDisplayOrder))
                        .map(ItemImage::getUrl)
                        .toList();

        String imagemPrincipal = imagens.isEmpty() ? null : imagens.get(0);

        LocalizacaoResponse localizacao = new LocalizacaoResponse(
                item.getLocationText(),
                null,
                null,
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
                item.getShortDescription(),
                imagens,
                localizacao,
                data
        );
    }
}
