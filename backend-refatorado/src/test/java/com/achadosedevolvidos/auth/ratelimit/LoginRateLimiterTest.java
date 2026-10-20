package com.achadosedevolvidos.auth.ratelimit;

import io.github.bucket4j.ConsumptionProbe;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class LoginRateLimiterTest {

    @Test
    void naoDeveBloquearEmailAntesDeAtingirOLimiteDeTentativasFalhas() {
        LoginRateLimiter rateLimiter = new LoginRateLimiter(20, 1, 3, 15);
        String email = "teste@exemplo.com";

        for (int i = 0; i < 3; i++) {
            assertThat(rateLimiter.isEmailRateLimited(email)).isFalse();
            rateLimiter.consumeEmailAttempt(email);
        }

        assertThat(rateLimiter.isEmailRateLimited(email)).isTrue();
    }

    @Test
    void loginBemSucedidoNuncaConsomeEResetaTentativasAnteriores() {
        LoginRateLimiter rateLimiter = new LoginRateLimiter(20, 1, 3, 15);
        String email = "sucesso@exemplo.com";

        // Duas falhas, depois reset (simula login certo na terceira tentativa).
        rateLimiter.consumeEmailAttempt(email);
        rateLimiter.consumeEmailAttempt(email);
        rateLimiter.resetEmailAttempts(email);

        assertThat(rateLimiter.isEmailRateLimited(email)).isFalse();

        // Bucket cheio de novo: suporta as 3 tentativas falhas inteiras, não só 1.
        rateLimiter.consumeEmailAttempt(email);
        rateLimiter.consumeEmailAttempt(email);
        assertThat(rateLimiter.isEmailRateLimited(email)).isFalse();
        rateLimiter.consumeEmailAttempt(email);
        assertThat(rateLimiter.isEmailRateLimited(email)).isTrue();
    }

    @Test
    void emailsDiferentesTemBucketsIndependentes() {
        LoginRateLimiter rateLimiter = new LoginRateLimiter(20, 1, 1, 15);

        rateLimiter.consumeEmailAttempt("vitima@exemplo.com");

        assertThat(rateLimiter.isEmailRateLimited("vitima@exemplo.com")).isTrue();
        assertThat(rateLimiter.isEmailRateLimited("outro@exemplo.com")).isFalse();
    }

    @Test
    void emailENormalizadoParaMaiusculaEEspacos() {
        LoginRateLimiter rateLimiter = new LoginRateLimiter(20, 1, 1, 15);

        rateLimiter.consumeEmailAttempt("  Usuario@Exemplo.com  ");

        assertThat(rateLimiter.isEmailRateLimited("usuario@exemplo.com")).isTrue();
    }

    @Test
    void ipDeveSerBloqueadoAposEsgotarACapacidade() {
        LoginRateLimiter rateLimiter = new LoginRateLimiter(2, 1, 20, 15);
        String ip = "127.0.0.1";

        assertThat(rateLimiter.tryConsumeIp(ip).isConsumed()).isTrue();
        assertThat(rateLimiter.tryConsumeIp(ip).isConsumed()).isTrue();

        ConsumptionProbe terceira = rateLimiter.tryConsumeIp(ip);
        assertThat(terceira.isConsumed()).isFalse();
        assertThat(terceira.getNanosToWaitForRefill()).isGreaterThan(0);
    }

    @Test
    void ipsDiferentesTemBucketsIndependentes() {
        LoginRateLimiter rateLimiter = new LoginRateLimiter(1, 1, 20, 15);

        assertThat(rateLimiter.tryConsumeIp("127.0.0.1").isConsumed()).isTrue();
        assertThat(rateLimiter.tryConsumeIp("127.0.0.1").isConsumed()).isFalse();
        assertThat(rateLimiter.tryConsumeIp("192.168.0.1").isConsumed()).isTrue();
    }
}
