-- Remove o motor de match automático e o chat (que era construído em cima de
-- match: cada mensagem pertencia a um match). Decisão do time de retirar a
-- funcionalidade por completo.

-- Notificações do tipo POSSIBLE_MATCH não têm mais sentido sem o motor de
-- match -- removidas antes de dropar as tabelas, para não deixar lixo
-- referenciando um recurso que não existe mais.
DELETE FROM notifications WHERE type = 'POSSIBLE_MATCH';

-- messages referencia matches (match_id NOT NULL) -- precisa dropar primeiro.
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS matches;

-- match_alerts_enabled não tem mais o que controlar.
ALTER TABLE user_preferences DROP COLUMN match_alerts_enabled;
