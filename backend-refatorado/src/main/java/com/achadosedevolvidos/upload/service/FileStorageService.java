package com.achadosedevolvidos.upload.service;

import com.achadosedevolvidos.shared.exception.AppException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

/**
 * Guarda o arquivo em disco local (MVP — sem custo/conta externa; próximo
 * passo natural é trocar por S3/Cloudflare R2 mantendo a mesma interface).
 *
 * <p>O nome do arquivo em disco é SEMPRE gerado aqui (UUID), nunca derivado do
 * nome original enviado pelo cliente — isso, sozinho, já impede path traversal
 * (ex.: "../../application.yml") e sobrescrita de outro arquivo por
 * coincidência de nome. A extensão também é escolhida por uma tabela fixa a
 * partir do Content-Type declarado, nunca copiada do nome original.</p>
 */
@Service
@Slf4j
public class FileStorageService {

    private static final Map<String, String> ALLOWED_CONTENT_TYPES = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/gif", ".gif"
    );

    private final Path uploadDir;

    public FileStorageService(@Value("${app.upload.dir:./uploads}") String uploadDir) {
        this.uploadDir = Path.of(uploadDir).toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.uploadDir);
        } catch (IOException e) {
            throw new IllegalStateException("Não foi possível criar o diretório de uploads: " + this.uploadDir, e);
        }
    }

    public String store(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException("Arquivo vazio ou ausente", HttpStatus.BAD_REQUEST);
        }

        String extension = ALLOWED_CONTENT_TYPES.get(file.getContentType());
        if (extension == null) {
            throw new AppException(
                    "Tipo de arquivo não suportado. Envie uma imagem JPEG, PNG, WEBP ou GIF.",
                    HttpStatus.BAD_REQUEST
            );
        }

        String filename = UUID.randomUUID() + extension;

        try (var input = file.getInputStream()) {
            Files.copy(input, uploadDir.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            log.error("Falha ao salvar arquivo enviado", e);
            throw new AppException("Falha ao salvar o arquivo", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return "/uploads/" + filename;
    }
}
