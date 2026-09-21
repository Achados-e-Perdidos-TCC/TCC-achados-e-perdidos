package com.achadosedevolvidos.config;

import com.achadosedevolvidos.auth.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

/**
 * Configura DOIS mecanismos de autenticação lado a lado, propositalmente isolados:
 *
 * <ul>
 *   <li><b>Bearer JWT</b>: stateless, validado por {@link JwtAuthenticationFilter}.
 *   Único mecanismo de login do app.</li>
 *   <li><b>Basic Auth do Swagger</b>: credencial única e fixa (env vars
 *   {@code SWAGGER_USERNAME}/{@code SWAGGER_PASSWORD}), independente das contas de
 *   usuário do app — só protege {@code /swagger-ui/**} e {@code /v3/api-docs/**},
 *   numa {@link SecurityFilterChain} própria e isolada da outra.</li>
 * </ul>
 *
 * Se um dos mecanismos falhar (ex.: chave JWT inválida, ou a credencial do Swagger
 * não configurada), o outro continua funcionando normalmente — nenhuma requisição
 * autenticada por um mecanismo passa pelo código do outro.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;
    private final PasswordEncoder passwordEncoder;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Value("${app.swagger.username}")
    private String swaggerUsername;

    @Value("${app.swagger.password}")
    private String swaggerPassword;

    /**
     * Roda ANTES da chain principal (@Order menor = maior prioridade) e só se
     * aplica a /swagger-ui/** e /v3/api-docs/** (securityMatcher restringe o
     * escopo) — para qualquer outro path, a requisição nem passa por aqui, cai
     * direto na chain principal abaixo. Basic Auth (não Bearer/sessão) porque é a
     * forma mais simples do navegador conseguir pedir usuário/senha pra abrir o
     * Swagger UI diretamente pela URL, sem precisar de nenhuma tela de login
     * própria só pra isso.
     */
    @Bean
    @Order(1)
    public SecurityFilterChain swaggerSecurityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html")
                .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .httpBasic(httpBasic -> {})
                // Basic Auth reenvia a credencial em toda requisição (não fica num
                // cookie ambiente) e este escopo só tem GET (visualizar
                // documentação) — nada aqui muda estado, então não há o que um
                // CSRF exploraria.
                .csrf(AbstractHttpConfigurer::disable)
                .userDetailsService(swaggerUserDetailsService());

        return http.build();
    }

    @Bean
    public UserDetailsService swaggerUserDetailsService() {
        return new InMemoryUserDetailsManager(
                org.springframework.security.core.userdetails.User
                        .withUsername(swaggerUsername)
                        .password(passwordEncoder.encode(swaggerPassword))
                        .roles("SWAGGER")
                        .build()
        );
    }

    @Bean
    @Order(2)
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Sem login baseado em sessão/cookie (era só o caso do OAuth2 Login,
                // removido) — só resta o Bearer JWT, que não é vulnerável a CSRF (o
                // header Authorization não é enviado automaticamente pelo navegador
                // como um cookie seria). API 100% stateless: nenhuma sessão HTTP é
                // criada nem consultada.
                //
                // ⚠️ Essa segurança depende de uma suposição do front-end que o
                // backend não controla: o token (access/refresh) NUNCA pode ser
                // guardado em cookie enviado automaticamente pelo navegador (nem
                // httpOnly). Se isso mudar um dia — ex.: front-end migrar para
                // cookie httpOnly como mitigação de XSS — CSRF passa a ser
                // explorável de novo (o cookie viajaria sozinho em requisições
                // cross-site, sem essa proteção pra barrar) e este `.disable()`
                // precisa ser revertido junto. Ver README-AUTH.md.
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        // Sem isso: qualquer sendError() (ex.: o 401 disparado pela chain do
                        // Swagger para paths fora do seu securityMatcher) gera um forward
                        // interno para /error, que cai aqui e — sem essa regra — seria
                        // barrado por anyRequest().authenticated() em vez de devolver o
                        // status de erro correto.
                        .requestMatchers("/error").permitAll()
                        // Handshake do WebSocket: a autenticação real acontece no
                        // STOMP CONNECT (StompAuthChannelInterceptor), não aqui.
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                        // Arquivos estáticos servidos localmente (imagens enviadas via
                        // POST /api/v1/uploads/images) — precisam ser públicos, já que a
                        // URL aparece embutida em respostas públicas (busca/detalhe de item).
                        .requestMatchers("/uploads/**").permitAll()
                        // Regras específicas ANTES da regra genérica de /items/**:
                        // busca e detalhe são públicos, mas /me e matches exigem login.
                        .requestMatchers(HttpMethod.GET, "/api/v1/items/me").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/items/*/matches").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/items/**").permitAll()
                        .requestMatchers("/api/v1/matches/**").authenticated()
                        .anyRequest().authenticated()
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
