CREATE TABLE notifications (
    id         UUID PRIMARY KEY,
    user_id    UUID         NOT NULL,
    type       VARCHAR(50)  NOT NULL,
    title      VARCHAR(255) NOT NULL,
    message    TEXT         NOT NULL,
    read       BOOLEAN      NOT NULL DEFAULT false,
    created_at TIMESTAMP    NOT NULL DEFAULT now(),

    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
