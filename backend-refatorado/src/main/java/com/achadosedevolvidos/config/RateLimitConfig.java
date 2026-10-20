package com.achadosedevolvidos.config;

import com.achadosedevolvidos.auth.filter.LoginRateLimitFilter;
import com.achadosedevolvidos.auth.ratelimit.LoginRateLimiter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

/**
 * LoginRateLimitFilter não é um @Component: registrar via
 * FilterRegistrationBean (em vez de deixar o Spring Boot aplicá-lo a toda
 * requisição por padrão) escopa o filtro só para /api/v1/auth/login — não há
 * motivo pra pagar o custo dessa checagem em nenhuma outra rota.
 */
@Configuration
@RequiredArgsConstructor
public class RateLimitConfig {

    private final LoginRateLimiter loginRateLimiter;
    private final ObjectMapper objectMapper;

    @Bean
    public FilterRegistrationBean<LoginRateLimitFilter> loginRateLimitFilter() {
        FilterRegistrationBean<LoginRateLimitFilter> registration = new FilterRegistrationBean<>(
                new LoginRateLimitFilter(loginRateLimiter, objectMapper)
        );
        registration.addUrlPatterns("/api/v1/auth/login");
        // Antes até da cadeia do Spring Security: uma requisição bloqueada aqui
        // não precisa passar por CORS/CSRF/autenticação pra ser rejeitada.
        registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return registration;
    }
}
