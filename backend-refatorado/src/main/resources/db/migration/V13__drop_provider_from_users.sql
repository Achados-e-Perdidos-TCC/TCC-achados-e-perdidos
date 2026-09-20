-- Login via Google (OAuth2) foi removido do produto: só resta o login local
-- (e-mail/senha), então não há mais o que distinguir por "provider".
ALTER TABLE users
    DROP COLUMN provider;
