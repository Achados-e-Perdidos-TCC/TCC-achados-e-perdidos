ALTER TABLE items
    ADD COLUMN estado VARCHAR(2),
    ADD COLUMN cidade VARCHAR(100),
    ADD COLUMN bairro VARCHAR(100);

ALTER TABLE items
    DROP COLUMN location_text;
