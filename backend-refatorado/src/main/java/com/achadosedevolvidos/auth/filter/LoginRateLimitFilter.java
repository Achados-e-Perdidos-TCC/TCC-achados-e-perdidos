package com.achadosedevolvidos.auth.filter;

import com.achadosedevolvidos.auth.ratelimit.LoginRateLimiter;
import com.achadosedevolvidos.shared.exception.ApiError;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * Registrado só para POST /api/v1/auth/login (ver RateLimitConfig) — proteção
 * volumétrica por IP, não a defesa principal contra força bruta (essa é por
 * e-mail, dentro de AuthService.login). Roda ANTES da cadeia do Spring
 * Security: uma requisição já bloqueada aqui nem chega a tocar o restante do
 * pipeline (JWT filter, Controller, banco).
 */
@RequiredArgsConstructor
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private final LoginRateLimiter rateLimiter;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request, HttpServletResponse response, FilterChain filterChain
    ) throws ServletException, IOException {
        ConsumptionProbe probe = rateLimiter.tryConsumeIp(clientIp(request));

        if (!probe.isConsumed()) {
            long retryAfterSeconds = TimeUnit.NANOSECONDS.toSeconds(probe.getNanosToWaitForRefill()) + 1;

            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write(objectMapper.writeValueAsString(new ApiError(
                    HttpStatus.TOO_MANY_REQUESTS.value(),
                    "Muitas tentativas de login a partir deste endereço. Tente novamente em alguns instantes."
            )));
            return;
        }

        filterChain.doFilter(request, response);
    }

    /**
     * Primeiro IP de X-Forwarded-For (se presente) — necessário atrás de um
     * proxy/load balancer, onde request.getRemoteAddr() seria sempre o IP
     * interno do proxy, não o do cliente real. Sem proxy (dev local), o
     * header não existe e cai no fallback.
     */
    private String clientIp(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
