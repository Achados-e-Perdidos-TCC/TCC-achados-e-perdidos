package com.achadosedevolvidos.upload.controller;

import com.achadosedevolvidos.upload.dto.UploadResponse;
import com.achadosedevolvidos.upload.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 * Genérico — a URL devolvida serve tanto pra {@code imageUrls} no cadastro de
 * item quanto pra {@code avatarUrl} do perfil (PATCH /users/me). Protegido por
 * {@code anyRequest().authenticated()} (regra padrão do SecurityConfig, não
 * precisa de regra explícita); os arquivos servidos em {@code /uploads/**},
 * por outro lado, são públicos — ver SecurityConfig.
 */
@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final FileStorageService fileStorageService;

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadResponse> uploadImage(@RequestParam("file") MultipartFile file) {
        String url = fileStorageService.store(file);
        return ResponseEntity.status(HttpStatus.CREATED).body(new UploadResponse(url));
    }
}
