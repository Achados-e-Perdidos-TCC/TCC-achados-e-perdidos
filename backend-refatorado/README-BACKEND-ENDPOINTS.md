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
| `POST /login` | Autentica e-mail/senha via `AuthenticationManager` → `DaoAuthenticationProvider`. | Credenciais inválidas ou conta desativada (`active=false`) → `401` genérico (não diferencia os dois casos, de propósito). **Rate limiting**: `429` se o IP exceder 60 req/min (`LoginRateLimitFilter`, roda antes até do Spring Security) ou se a conta exceder 5 tentativas falhas em 15 min (`AuthService.login` — só conta falha, reseta no sucesso). Ver `ARQUITETURA.md`, seção 15. |
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
| `PATCH /preferences` | Liga/desliga `notificationsEnabled`/`emailsEnabled`/`showEmailOnItems`, atualização parcial. | Find-or-create: cria a linha em `user_preferences` na primeira chamada (não existe uma por padrão). `showEmailOnItems` controla se `emailResponsavel` aparece no detalhe público dos itens do usuário (seção 4). |
| `DELETE /` | **Soft delete de conta.** Marca `active=false`, revoga todos os refresh tokens, marca todos os itens do usuário como `INATIVO`. | Efeito imediato: bloqueia login novo (`DisabledException` → `401`) **e** qualquer token já emitido (`JwtAuthenticationFilter` checa `isEnabled()`). Não apaga nenhuma linha do banco. |

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
| `POST /` | 🔒 | Cria o item. | `categoryId` precisa existir (`400` se não); `eventDate` não pode ser futuro; `shortDescription` até 100 caracteres. |
| `GET /search` | público | Busca com filtros combináveis (`type`, `categoryId`, `query`, `locationText`, intervalo de datas), paginada. | Implementado via `ItemSpecifications` (Spring Data JPA Specification), cada filtro isolado. Busca por raio geográfico (lat/lng) ainda **não** filtra de fato — ver pendências no `ARQUITETURA.md`. Nunca inclui `emailResponsavel` (ver `GET /{id}`). |
| `GET /{id}` | público | Detalhe do item. Inclui `emailResponsavel` (e-mail do dono) se o dono não tiver desligado `showEmailOnItems`. | `404` se não existir **ou** se estiver `INATIVO` (soft-deletado) — a menos que quem pergunta seja o próprio dono via `GET /me`. `emailResponsavel` só é resolvido aqui, nunca em listagem/busca — ver `ARQUITETURA.md`, seção 16. |
| `GET /me` | 🔒 | "Meus objetos", com filtro combinado `status`. | `status` aceita tanto um `ItemType` (PERDIDO/ENCONTRADO) quanto um `ItemStatus` real — `parseCombinedStatusFilter` tenta os dois, `400` se não bater com nenhum. |
| `PATCH /{id}` | 🔒 (dono) | Atualização parcial dos campos editáveis. | `403` se quem chama não for `item.getUser().getId()`. `type` não é editável (fixo desde a criação); status tem endpoint próprio. |
| `DELETE /{id}` | 🔒 (dono) | Soft delete — marca `status=INATIVO`, não apaga a linha. | `403` se não for o dono. |
| `PATCH /{id}/status` | 🔒 (dono) | Muda só o status de workflow (`ANALISANDO`/`PROCURANDO`/`RESOLVIDO`/`INATIVO`). | `403` se não for o dono. |

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

## 6. Notificações (`/api/v1/notifications`) — `notification/` — todos 🔒

| Endpoint | O que faz | Exigências / regras |
|---|---|---|
| `GET /` | Lista as notificações do usuário logado, mais recentes primeiro. | — |
| `PATCH /{id}/read` | Marca uma notificação específica como lida. | `404` se não existir, `403` se não for do usuário logado. |
| `PATCH /read-all` | Marca todas as notificações do usuário como lidas de uma vez. | `UPDATE` em massa (`NotificationRepository.markAllAsReadByUserId`), não carrega uma a uma. |

Não existem endpoints de criação — uma notificação nasce sozinha, disparada
por evento de domínio de outros módulos:

- `ItemServiceImpl.updateStatus` → `ITEM_UPDATED`
- `UserServiceImpl.updateProfile` → `PROFILE_UPDATED`

Cada criação respeita a preferência `notificationsEnabled` do usuário em
`user_preferences` — ver `ARQUITETURA.md`, seção 14. Migration: `V17`.

---

## 7. O que ainda falta fazer

Fora de escopo por decisão do time (não confundir com "esquecido"):

- Match automático e chat em tempo real foram implementados e depois
  **removidos por completo** (migration `V19`) — decisão do time, não
  reimplementar sem alinhar antes.
- Busca geográfica por raio de verdade (PostGIS ou Haversine).
- Troca do storage de upload de disco local por S3/Cloudflare R2.

Detalhes técnicos e justificativa de cada decisão de arquitetura:
`ARQUITETURA.md`. Setup do ambiente: `README-BACKEND-SETUP.md`.
