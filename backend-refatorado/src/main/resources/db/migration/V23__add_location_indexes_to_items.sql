CREATE INDEX idx_items_estado ON items (LOWER(estado));
CREATE INDEX idx_items_cidade ON items (LOWER(cidade));
CREATE INDEX idx_items_bairro ON items (LOWER(bairro));
