package com.achadosedevolvidos.auth.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Supplier;

/**
 * Duas defesas independentes contra força bruta em POST /api/v1/auth/login,
 * cada uma cobrindo um cenário que a outra não cobre:
 *
 * <ul>
 *   <li><b>Por IP</b>: limite "largo" (volumétrico) — barra um único cliente
 *   inundando o endpoint, independente de contra qual conta. Não é a defesa
 *   principal contra força bruta (um atacante com uma botnet distribui as
 *   tentativas entre vários IPs), só uma proteção básica contra flood.</li>
 *   <li><b>Por e-mail</b>: a defesa de verdade contra força bruta/credential
 *   stuffing numa conta específica, mesmo que as tentativas venham de IPs
 *   diferentes. Só consome o bucket em caso de falha — login certo de
 *   primeira nunca é penalizado, e um login bem-sucedido reseta o contador da
 *   conta (ver {@link #resetEmailAttempts}).</li>
 * </ul>
 *
 * <p>Buckets em memória, por isso {@code bucket4j-core} puro (sem
 * `bucket4j-spring-boot-starter`, que já assume um backend externo) é
 * suficiente — ver nota sobre múltiplas instâncias no `pom.xml`.</p>
 */
@Component
public class LoginRateLimiter {

    private final ConcurrentHashMap<String, Bucket> ipBuckets = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Bucket> emailBuckets = new ConcurrentHashMap<>();

    private final int ipCapacity;
    private final Duration ipRefillPeriod;
    private final int emailCapacity;
    private final Duration emailRefillPeriod;

    public LoginRateLimiter(
            @Value("${app.rate-limit.login.ip-capacity:60}") int ipCapacity,
            @Value("${app.rate-limit.login.ip-refill-minutes:1}") long ipRefillMinutes,
            @Value("${app.rate-limit.login.email-capacity:5}") int emailCapacity,
            @Value("${app.rate-limit.login.email-refill-minutes:15}") long emailRefillMinutes
    ) {
        this.ipCapacity = ipCapacity;
        this.ipRefillPeriod = Duration.ofMinutes(ipRefillMinutes);
        this.emailCapacity = emailCapacity;
        this.emailRefillPeriod = Duration.ofMinutes(emailRefillMinutes);
    }

    /** Consome 1 token incondicionalmente — toda requisição ao endpoint conta, sucesso ou falha. */
    public ConsumptionProbe tryConsumeIp(String ip) {
        return resolveBucket(ipBuckets, ip, () -> newBucket(ipCapacity, ipRefillPeriod))
                .tryConsumeAndReturnRemaining(1);
    }

    /**
     * Só consulta, não consome — chamar ANTES de validar a senha, pra rejeitar
     * de cara uma conta já no limite sem nem ir ao banco comparar a senha.
     */
    public boolean isEmailRateLimited(String email) {
        return resolveBucket(emailBuckets, normalize(email), () -> newBucket(emailCapacity, emailRefillPeriod))
                .getAvailableTokens() < 1;
    }

    /** Só chamar quando a tentativa de login falhar — login certo nunca consome. */
    public void consumeEmailAttempt(String email) {
        resolveBucket(emailBuckets, normalize(email), () -> newBucket(emailCapacity, emailRefillPeriod))
                .tryConsume(1);
    }

    /** Login bem-sucedido: tentativas falhas anteriores não devem continuar contando. */
    public void resetEmailAttempts(String email) {
        emailBuckets.remove(normalize(email));
    }

    private Bucket resolveBucket(ConcurrentHashMap<String, Bucket> buckets, String key, Supplier<Bucket> factory) {
        return buckets.computeIfAbsent(key, k -> factory.get());
    }

    private Bucket newBucket(int capacity, Duration refillPeriod) {
        Bandwidth limit = Bandwidth.classic(capacity, Refill.greedy(capacity, refillPeriod));
        return Bucket.builder().addLimit(limit).build();
    }

    private String normalize(String email) {
        return email.trim().toLowerCase();
    }
}
