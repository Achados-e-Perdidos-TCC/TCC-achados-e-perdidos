> ## ⚠️ IMPORTANTE — leia antes de começar a codar
>
> **Todo desenvolvimento precisa de uma branch própria, criada a partir de
> `main`/`backend-develop`, com nome claro e condizente com o que está sendo
> feito.** Nada de commitar direto em `main` ou `backend-develop`, nem
> misturar duas features na mesma branch.
>
> Padrão usado neste projeto: `feature/<o-que-foi-feito>` (ex.:
> `feature/user-preferences-and-delete-account`,
> `feature/remove-google-oauth2`) ou `fix/<o-que-foi-corrigido>` para
> correções pontuais. O nome da branch sozinho já deve dar pra entender o
> escopo do PR sem precisar abrir a descrição.

# Catálogo de Endpoints — Achados e Devolvidos (equipe de backend)

O que já está implementado (com as regras que cada endpoint aplica) e o que
ainda falta fazer. Para os contratos completos de request/response, veja
`README-FRONTEND.md` — este documento foca no que cada endpoint **faz** e
**exige** do lado do servidor, não no shape do JSON.

---

## 1. Auth (`/api/v1/auth`) — `auth/`

Nenhum destes exige autenticação (fazem parte do próprio fluxo de login).

| Endpoint | O que faz | Exigências / regras |
|---|---|---|
| `POST /register` | Cria a conta e já devolve `accessToken`/`refreshToken` (login automático). | E-mail precisa ser único (`409` se já existir); senha ≥ 8 caracteres. |
| `POST /login` | Autentica e-mail/senha via `AuthenticationManager` → `DaoAuthenticationProvider`. | Credenciais inválidas ou conta desativada (`active=false`) → `401` genérico (não diferencia os dois casos, de propósito). |
| `POST /refresh` | Renova o `accessToken`, rotacionando o `refreshToken` (o antigo é revogado). | Precisa de um `refreshToken` assinado, não expirado e presente/válido em `refresh_tokens` (não revogado). |
| `POST /logout` | Revoga um `refreshToken` específico. | Idempotente — sempre `200`, mesmo com token já revogado/inexistente. |
| `POST /forgot-password` | Se o e-mail existir, envia link de redefinição por e-mail (token de uso único, expira em `PASSWORD_RESET_EXPIRATION_MINUTES`). | Resposta idêntica exista ou não o e-mail — nunca revelar isso ao chamador. |
| `POST /reset-password` | Define nova senha a partir do token do e-mail; revoga **todos** os refresh tokens da conta. | Token precisa existir, não expirado, não usado ainda; nova senha ≥ 8 caracteres. |

Implementação: `AuthController` → `AuthService` (sem interface — é o único
service do projeto implementado direto, por ser pequeno) → `UserRepository` +
`RefreshTokenRepository` + `PasswordResetTokenRepository`.

---

## 2. Perfil de usuário (`/api/v1/users/me`) — `user/` — todos 🔒

| Endpoint | O que faz | Exigências / regras |
|---|---|---|
| `GET /` | Devolve o perfil do usuário autenticado, com as preferências aninhadas. | — |
| `PATCH /` | Atualização parcial (`name`, `phone`, `city`, `avatarUrl`) — campo omitido/`null` = mantém. | `name`, se enviado, não pode ser vazio/só espaço (`400`). |
| `PATCH /password` | Troca a senha; revoga **todos** os refresh tokens da conta ao final. | Exige a senha atual correta (`401` se errada); nova senha ≥ 8 caracteres. |
| `PATCH /preferences` | Liga/desliga `notificationsEnabled`/`matchAlertsEnabled`/`emailsEnabled`, atualização parcial. | Find-or-create: cria a linha em `user_preferences` na primeira chamada (não existe uma por padrão). |
| `DELETE /` | **Soft delete de conta.** Marca `active=false`, revoga todos os refresh tokens, marca todos os itens do usuário como `INATIVO`. | Efeito imediato: bloqueia login novo (`DisabledException` → `401`) **e** qualquer token já emitido (`JwtAuthenticationFilter`/`StompAuthChannelInterceptor` checam `isEnabled()`). Não apaga nenhuma linha do banco. |

Implementação: `UserController` → `UserService`/`UserServiceImpl` →
`UserRepository` + `UserPreferencesRepository` + `RefreshTokenRepository` +
`ItemRepository` (bulk update dos itens). Migrations: `V14` (perfil), `V15`
(`active`), `V16` (`user_preferences`).

---

## 3. Categorias (`/api/v1/categories`) — `category/` — público

| Endpoint | O que faz | Exigências / regras |
|---|---|---|
| `GET /` | Lista todas as categorias (`id`, `name`, `iconUrl`). | Somente leitura, sem service dedicado — o controller fala direto com `CategoryRepository`. |

---

## 4. Itens (`/api/v1/items`) — `item/`

| Endpoint | Auth | O que faz | Exigências / regras |
|---|---|---|---|
| `POST /` | 🔒 | Cria o item e dispara o motor de match assincronamente (`ItemCreatedEvent` → listener `@Async` após commit). | `categoryId` precisa existir (`400` se não); `eventDate` não pode ser futuro; `shortDescription` até 100 caracteres. |
| `GET /search` | público | Busca com filtros combináveis (`type`, `categoryId`, `query`, `locationText`, intervalo de datas), paginada. | Implementado via `ItemSpecifications` (Spring Data JPA Specification), cada filtro isolado. Busca por raio geográfico (lat/lng) ainda **não** filtra de fato — ver pendências no `ARQUITETURA.md`. |
| `GET /{id}` | público | Detalhe do item. | `404` se não existir **ou** se estiver `INATIVO` (soft-deletado) — a menos que quem pergunta seja o próprio dono via `GET /me`. |
| `GET /{id}/matches` | 🔒 | Lista os matches encontrados para o item. | Qualquer usuário autenticado pode consultar, não só o dono. |
| `GET /me` | 🔒 | "Meus objetos", com filtro combinado `status`. | `status` aceita tanto um `ItemType` (PERDIDO/ENCONTRADO) quanto um `ItemStatus` real — `parseCombinedStatusFilter` tenta os dois, `400` se não bater com nenhum. |
| `PATCH /{id}` | 🔒 (dono) | Atualização parcial dos campos editáveis. | `403` se quem chama não for `item.getUser().getId()`. `type` não é editável (fixo desde a criação); status tem endpoint próprio. |
| `DELETE /{id}` | 🔒 (dono) | Soft delete — marca `status=INATIVO`, não apaga a linha. | `403` se não for o dono. Motivo de ser soft delete: `matches`/`messages` já vinculados não têm `ON DELETE CASCADE`. |
| `PATCH /{id}/status` | 🔒 (dono) | Muda só o status de workflow (`ANALISANDO`/`PROCURANDO`/`POSSIVEL_MATCH`/`RESOLVIDO`/`INATIVO`). | `403` se não for o dono. |

Implementação: `ItemController` → `ItemService`/`ItemServiceImpl` →
`ItemRepository` (+ `ItemSpecifications` para a busca). Verificação de dono
via helper `ensureOwner`.

---

## 5. Upload (`/api/v1/uploads`) — `upload/` — 🔒

| Endpoint | O que faz | Exigências / regras |
|---|---|---|
| `POST /images` | Grava a imagem em disco local (`FileStorageService`) e devolve a URL pública. | Só `image/jpeg`\|`png`\|`webp`\|`gif` (checado pelo `Content-Type` declarado, não pela extensão do nome enviado); até 5MB (`max-file-size`/`max-request-size`). Nome do arquivo em disco é **sempre** gerado por UUID — nunca derivado do nome original (evita path traversal e upload disfarçado). |

`GET /uploads/{arquivo}` (fora de `/api/v1`) é público e serve o arquivo —
não exige login, já que a URL aparece embutida em respostas públicas de item.

MVP deliberado: storage em disco local, não sobrevive a um redeploy do
container. Próximo passo natural é trocar por S3/Cloudflare R2 mantendo a
mesma interface de `FileStorageService`.

---

## 6. Chat (`match/{matchId}/messages` REST + WebSocket) — `chat/`

| Endpoint | Auth | O que faz | Exigências / regras |
|---|---|---|---|
| `GET /api/v1/matches/{matchId}/messages` | 🔒 | Histórico de mensagens do match. | Quem chama precisa ser um dos dois donos de item do match (`ChatServiceImpl` valida). |
| `WS /ws` (SockJS) + `SEND /app/chat.sendMessage/{matchId}` | 🔒 (no `CONNECT`) | Envia mensagem em tempo real, publicada em `/topic/conversation/{matchId}`. | `StompAuthChannelInterceptor` exige `Authorization: Bearer <jwt>` como header nativo do frame `CONNECT`, valida assinatura/expiração **e** `isEnabled()` (conta não pode estar desativada). Remetente vem do `Principal` da sessão autenticada, nunca de um campo enviado pelo cliente. |

Match em si não tem endpoint de criação — é gerado automaticamente pelo motor
de match (`match/service/MatchEngineService`) quando um item é criado, sem
nenhuma ação manual do usuário.

---

## 7. O que ainda falta fazer

Nenhum endpoint implementado ainda para estes três módulos:

1. **Notificações** — ex.: listar notificações do usuário, marcar como lida.
2. **Favoritos** — ex.: favoritar/desfavoritar item, listar favoritos do
   usuário.
3. **Dashboard** — ex.: métricas/estatísticas do usuário ou do sistema.

Fora de escopo por decisão do time (não confundir com "esquecido"):

- Endpoints de **ação manual sobre Matching** (aceitar/rejeitar um match
  manualmente) — hoje o match é só criado automaticamente e consultado via
  `GET /items/{id}/matches`. Não implementar sem alinhar com o time antes.
- Rate limiting no `/api/v1/auth/login`.
- Busca geográfica por raio de verdade (PostGIS ou Haversine).
- Troca do storage de upload de disco local por S3/Cloudflare R2.

Detalhes técnicos e justificativa de cada decisão de arquitetura:
`ARQUITETURA.md`. Setup do ambiente: `README-BACKEND-SETUP.md`.
