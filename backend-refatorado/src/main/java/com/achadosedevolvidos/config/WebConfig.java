package com.achadosedevolvidos.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

/**
 * Expõe o diretório de uploads (fora do classpath) como arquivo estático em
 * /uploads/** — é essa URL que POST /api/v1/uploads/images devolve. O
 * Content-Type de cada resposta é inferido pela extensão do arquivo (sempre
 * uma das fixas escolhidas por FileStorageService), não pelo que o cliente
 * declarou no upload.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.dir:./uploads}")
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(uploadDir).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler("/uploads/**").addResourceLocations(location);
    }
}
