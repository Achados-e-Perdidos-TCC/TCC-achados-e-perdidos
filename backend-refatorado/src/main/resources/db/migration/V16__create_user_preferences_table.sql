CREATE TABLE user_preferences (
    id                      UUID PRIMARY KEY,
    user_id                 UUID         NOT NULL,
    notifications_enabled   BOOLEAN      NOT NULL DEFAULT true,
    match_alerts_enabled    BOOLEAN      NOT NULL DEFAULT true,
    emails_enabled          BOOLEAN      NOT NULL DEFAULT true,
    created_at              TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT uk_user_preferences_user_id UNIQUE (user_id),
    CONSTRAINT fk_user_preferences_user FOREIGN KEY (user_id) REFERENCES users (id)
);
