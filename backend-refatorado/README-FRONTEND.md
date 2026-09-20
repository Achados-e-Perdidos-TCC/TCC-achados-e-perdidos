# Guia de Integração — Front-end

Documento único para o time de front-end: todos os endpoints da API (request,
response, autenticação) e todas as regras de segurança que o cliente precisa
respeitar para não abrir um buraco de segurança no que o backend já construiu.

Para outros assuntos, veja:
- **`README-AUTH.md`** — detalhamento fino do fluxo de autenticação (rotação
  de refresh token, forgot/reset-password) — o essencial já está resumido
  aqui na seção 2, mas vale a leitura se algo no fluxo de login parecer
  estranho.
- **`README-OPENAPI.md`** — como gerar tipos TypeScript automaticamente a
  partir da API real, em vez de copiar os shapes abaixo à mão.
- **`ARQUITETURA.md`** — o "porquê" de cada decisão, se precisar entender o
  motivo por trás de alguma regra.

---

## 1. Base URL e convenções

- REST: `http://localhost:8080/api/v1` em dev (produção/staging: peça a URL
  ao time de backend).
- WebSocket (chat): `ws://localhost:8080/ws` (SockJS).
- Todo endpoint autenticado é marcado com 🔒 abaixo e exige o header:
  ```
  Authorization: Bearer <accessToken>
  ```
- Corpo de request/response sempre em JSON (exceto upload, que é
  `multipart/form-data`).
- Erros seguem sempre o mesmo formato, **exceto** os 4xx de validação de
  `@Valid` (ver seção 5).

---

## 2. Segurança — regras obrigatórias

Estas regras não são sugestões de estilo: o backend tomou decisões de
segurança (CORS, CSRF desabilitado, stateless) que **dependem** do front-end
segui-las à risca. Quebrar uma delas reabre uma vulnerabilidade que hoje está
fechada.

### 2.1. Nunca guarde o token em cookie (nem `httpOnly`)

A API é 100% stateless: nenhuma sessão HTTP, nenhum cookie de autenticação.
`SecurityConfig` desabilita CSRF (`.csrf(disable)`) partindo do princípio de
que `accessToken`/`refreshToken` ficam em memória/`localStorage` e são
anexados manualmente pelo JS a cada chamada — nunca enviados sozinhos pelo
navegador como um cookie seria.

> ⚠️ **Se isso mudar** (ex.: migrar para cookie `httpOnly` como mitigação de
> XSS), isso reabre CSRF em todo endpoint que muda estado (criar item, trocar
> senha, excluir conta, etc.). Avise o backend **antes** de mudar — o CSRF
> precisa voltar a ser ativado junto, em coordenação.

Não é preciso `credentials: 'include'` / `withCredentials: true` em nenhuma
chamada — a API nunca depende de cookie.

### 2.2. CORS — sua origem precisa estar na allowlist do backend

O backend só aceita requisições de origens configuradas em
`CORS_ALLOWED_ORIGINS` (variável de ambiente do backend, não algo que o
front-end configura). Se uma chamada falhar silenciosamente no browser com
erro de CORS no console, o mais provável é que a origem (`http://localhost:xxxx`,
domínio de staging, etc.) ainda não foi adicionada — peça ao backend para
incluir.

### 2.3. Rotação de refresh token

Toda vez que `POST /auth/refresh` é chamado, o `refreshToken` enviado deixa
de funcionar — o novo `refreshToken` da resposta é quem passa a valer.
**Sempre sobrescreva o `refreshToken` salvo com o que voltou de cada chamada**,
nunca reaproveite o antigo. Duas chamadas simultâneas com o mesmo token (ex.:
duas abas fazendo refresh ao mesmo tempo) fazem a segunda falhar com `401`.

### 2.4. Conta desativada invalida tudo na hora

`DELETE /users/me` (seção 4.5) não é hard delete, mas o efeito prático sobre
sessão é o mesmo de um reset de senha:
- O `accessToken` atual **para de funcionar já na próxima requisição** —
  qualquer chamada autenticada depois do `DELETE` responde `403`.
- Login futuro com essa conta responde `401`.

**Depois de uma chamada `DELETE /users/me` bem-sucedida, limpe os tokens
salvos e redirecione para a tela de login/logout imediatamente** — não espere
a próxima chamada autenticada falhar para perceber. Isso vale para REST e
para o WebSocket do chat: se o cliente tentar abrir uma nova conexão STOMP
com o token da conta desativada, o servidor recusa o `CONNECT` (mesmo
tratamento de um token inválido/expirado — seção 2.8).

### 2.5. Forgot-password nunca revela se o e-mail existe

`POST /auth/forgot-password` sempre responde `200` com a mesma mensagem
genérica, exista ou não o e-mail. Não construa uma tela de "e-mail não
encontrado" a partir da resposta desse endpoint — é assim por design, para
não permitir descobrir quais e-mails estão cadastrados testando um por um.

### 2.6. Logout é fire-and-forget

`POST /auth/logout` sempre responde `200`, mesmo com token já inválido ou
inexistente (idempotente). Não precisa tratar erro — só limpar os tokens
salvos no cliente.

### 2.7. Upload de imagens

`POST /uploads/images` só aceita `image/jpeg`, `image/png`, `image/webp` ou
`image/gif`, até 5MB. O nome do arquivo salvo é sempre gerado pelo servidor
(UUID) — a extensão original enviada pelo cliente é ignorada, então não
dependa dela para nada no front (ex.: não assuma que a URL devolvida termina
com a mesma extensão do arquivo escolhido pelo usuário).

### 2.8. Autenticação do WebSocket (chat)

O handshake HTTP do SockJS (`/ws`) é público — a autenticação de verdade
acontece no frame STOMP `CONNECT`, que precisa carregar um **header nativo do
STOMP** (não query param, não corpo):

```javascript
const client = new StompJs.Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  connectHeaders: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

Sem esse header (ou com um token inválido/expirado), o servidor recusa o
`CONNECT`. Um `accessToken` que já funciona nas chamadas REST funciona aqui
também — é o mesmo token, mesma validação.

---

## 3. Fluxo de autenticação, passo a passo

1. `POST /auth/register` (cadastro) ou `POST /auth/login` — ambos devolvem
   `{ accessToken, refreshToken, tokenType: "Bearer", expiresInSeconds }`
   (`register` já loga automaticamente).
2. Guarde os dois tokens (memória + storage seguro — nunca cookie, seção 2.1).
3. Em toda chamada autenticada, envie `Authorization: Bearer <accessToken>`.
4. Quando o `accessToken` expirar (uma chamada volta `401`), chame
   `POST /auth/refresh` com o `refreshToken` salvo, sobrescreva **os dois**
   tokens com a resposta (seção 2.3), e repita a chamada original.
5. Se o `refresh` também falhar (`401` — refresh token expirado/revogado),
   limpe os tokens e mande o usuário para a tela de login.
6. `POST /auth/logout` ao sair — sempre `200`, limpe os tokens depois.

---

## 4. Catálogo completo de endpoints

### 4.1. Auth (`/api/v1/auth`) — nenhum exige token

| Método | Path | Body | Resposta |
|---|---|---|---|
| POST | `/register` | `{ name, email, password }` (senha ≥ 8 chars) | `201` `AuthResponse` |
| POST | `/login` | `{ email, password }` | `200` `AuthResponse` |
| POST | `/refresh` | `{ refreshToken }` | `200` `AuthResponse` (novo par — seção 2.3) |
| POST | `/logout` | `{ refreshToken }` | `200` `{ message }` (sempre) |
| POST | `/forgot-password` | `{ email }` | `200` `{ message }` (sempre — seção 2.5) |
| POST | `/reset-password` | `{ token, newPassword }` (token vem do link no e-mail) | `200` `{ message }` |

`AuthResponse`: `{ accessToken: string, refreshToken: string, tokenType: "Bearer", expiresInSeconds: number }`

### 4.2. Perfil de usuário (`/api/v1/users/me`) — todos 🔒

| Método | Path | Body | Resposta | Ação |
|---|---|---|---|---|
| GET | `/` | — | `200` `UserProfileResponse` | Perfil do usuário logado, incluindo preferências atuais. |
| PATCH | `/` | `UpdateProfileRequest` (parcial) | `200` `UserProfileResponse` | Atualiza só os campos enviados (`null`/omitido = mantém). |
| PATCH | `/password` | `{ currentPassword, newPassword }` (nova ≥ 8 chars) | `200` `{ message }` | Exige a senha atual; revoga todos os refresh tokens ao final (desloga outros dispositivos). |
| PATCH | `/preferences` | `UpdatePreferencesRequest` (parcial) | `200` `PreferencesResponse` | Liga/desliga notificações, alertas de match, e-mails. |
| DELETE | `/` | — | `200` `{ message }` | **Zona de perigo.** Soft delete — ver seção 2.4 antes de usar. |

```ts
// UserProfileResponse
{
  id: string;            // UUID
  name: string;
  email: string;
  phone: string | null;
  city: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  createdAt: string;     // ISO datetime
  preferences: PreferencesResponse;
}

// UpdateProfileRequest (todos os campos opcionais)
{ name?: string; phone?: string; city?: string; avatarUrl?: string }
// name, se enviado, não pode ser string vazia/só espaços (400)

// PreferencesResponse
{ notificationsEnabled: boolean; matchAlertsEnabled: boolean; emailsEnabled: boolean }

// UpdatePreferencesRequest (todos os campos opcionais — omitido/null = mantém valor atual)
{ notificationsEnabled?: boolean; matchAlertsEnabled?: boolean; emailsEnabled?: boolean }
// Se o usuário nunca chamou PATCH /preferences, GET /users/me.preferences vem com tudo `true`.
```

### 4.3. Categorias (`/api/v1/categories`) — público

| Método | Path | Resposta |
|---|---|---|
| GET | `/` | `200` `CategoryResponse[]` |

```ts
// CategoryResponse
{ id: string; name: string; iconUrl: string | null }
```

### 4.4. Itens (`/api/v1/items`)

| Método | Path | Auth | Body / Query | Resposta | Ação |
|---|---|---|---|---|---|
| POST | `/` | 🔒 | `CreateItemRequest` | `201` `ItemResponse` | Cria o item; dispara o motor de match assincronamente (não afeta a resposta). |
| GET | `/search` | público | query: `type, categoryId, query, locationText, dateFrom, dateTo, lat, lng, page, size, sort` | `200` `Page<ItemResponse>` | Busca pública, todos os filtros opcionais e combináveis. |
| GET | `/{id}` | público | — | `200` `ItemResponse` | `404` se não existir ou estiver `INATIVO` (e você não for o dono — ver `/me`). |
| GET | `/{id}/matches` | 🔒 | — | `200` `MatchResponse[]` | Qualquer usuário logado pode ver, não só o dono. |
| GET | `/me` | 🔒 | query: `status` (opcional), `page, size, sort` | `200` `Page<ItemResponse>` | "Meus objetos". `status` aceita **tanto** um `type` (`PERDIDO`/`ENCONTRADO`) **quanto** um status real (`ANALISANDO`/`PROCURANDO`/`POSSIVEL_MATCH`/`RESOLVIDO`/`INATIVO`) — é o mesmo query param pros dois casos; valor que não bate com nenhum dos dois devolve `400`. |
| PATCH | `/{id}` | 🔒 (dono) | `UpdateItemRequest` (parcial) | `200` `ItemResponse` | `403` se não for o dono. `type` não é editável (fixo desde a criação); status tem endpoint próprio, abaixo. |
| DELETE | `/{id}` | 🔒 (dono) | — | `204` | Soft delete (`status = INATIVO`) — some da busca pública e do detalhe pra quem não é o dono, mas continua em `GET /items/me`. |
| PATCH | `/{id}/status` | 🔒 (dono) | `{ status }` | `200` `ItemResponse` | Muda só o status de workflow. |

```ts
// CreateItemRequest
{
  type: "PERDIDO" | "ENCONTRADO";   // obrigatório
  categoryId: string;               // UUID, obrigatório, precisa existir
  title: string;                    // obrigatório
  description: string;              // obrigatório
  shortDescription: string;         // obrigatório, máx. 100 caracteres
  locationText?: string;
  latitude: number;                 // obrigatório
  longitude: number;                // obrigatório
  eventDate: string;                // ISO datetime, obrigatório, não pode ser futuro
  imageUrls?: string[];             // URLs devolvidas por POST /uploads/images
}

// UpdateItemRequest (todos os campos opcionais — omitido/null = mantém)
{
  categoryId?: string; title?: string; description?: string; shortDescription?: string;
  locationText?: string; latitude?: number; longitude?: number; eventDate?: string;
  imageUrls?: string[];
}

// { status } de PATCH /{id}/status
{ status: "ANALISANDO" | "PROCURANDO" | "POSSIVEL_MATCH" | "RESOLVIDO" | "INATIVO" }

// ItemResponse — formato acordado com o front-end (mesmo shape em busca, detalhe e criação)
{
  id: string;
  imagemPrincipal: string | null;
  nome: string;
  status: "PERDIDO" | "ENCONTRADO";   // atenção: aqui é o TYPE, não o status de workflow
  categoria: string;
  icon_url: string | null;
  descricao: string;
  imagensSecundarias: string[];
  localizacao: {
    endereco: string | null;   // hoje é o único campo preenchido
    cidade: string | null;     // sempre null por enquanto (endereço não é estruturado ainda)
    estado: string | null;     // idem
    latitude: number | null;
    longitude: number | null;
    complemento: string | null; // idem
  };
  data: { data: string | null; hora: string | null };
}

// MatchResponse
{
  id: string;
  lostItemId: string; lostItemTitle: string;
  foundItemId: string; foundItemTitle: string;
  score: number;
  status: "PENDENTE" | "ACEITO" | "REJEITADO";
  createdAt: string;
}
```

`Page<T>` é o formato padrão do Spring Data:
`{ content: T[], totalElements, totalPages, number, size, ... }`.

### 4.5. Upload (`/api/v1/uploads`) — 🔒

| Método | Path | Body | Resposta |
|---|---|---|---|
| POST | `/images` | `multipart/form-data`, campo `file` | `201` `{ url: string }` |

A `url` devolvida (ex.: `/uploads/1e2d...-xyz.jpg`) é relativa ao host da API
— use direto em `imageUrls` no cadastro de item ou como `avatarUrl` do
perfil. O arquivo servido em `GET /uploads/{arquivo}` é público (não precisa
de token pra exibir a imagem), só o upload em si exige login. Ver seção 2.7
para as restrições de tipo/tamanho.

### 4.6. Chat

Histórico via REST, tempo real via WebSocket — os dois usam o `matchId` como
identificador da conversa.

| Método | Path | Auth | Resposta |
|---|---|---|---|
| GET | `/api/v1/matches/{matchId}/messages` | 🔒 | `200` `ChatMessageResponse[]` |

```ts
// ChatMessageResponse
{
  id: string; matchId: string;
  senderId: string; senderName: string;
  content: string; sentAt: string;
}
```

**WebSocket** (ver autenticação na seção 2.8):

```javascript
client.onConnect = () => {
  client.subscribe(`/topic/conversation/${matchId}`, (frame) => {
    const message = JSON.parse(frame.body); // ChatMessageResponse
  });
};

client.publish({
  destination: `/app/chat.sendMessage/${matchId}`,
  body: JSON.stringify({ content: "texto da mensagem" }),
});
```

Não existe `senderId` no payload de envio — o remetente vem da autenticação
da conexão, nunca de um campo que o cliente manda (isso é proposital, evita
alguém mandar mensagem se passando por outro usuário).

---

## 5. Formato de erro

Toda resposta de erro (exceto validação de `@Valid`, abaixo) segue:

```ts
{ status: number; message: string; timestamp: string }
```

Validação de payload (`400`, campo obrigatório ausente, e-mail inválido,
senha curta, etc.) usa o mesmo shape, mas `message` é uma string com todos os
erros concatenados (`"campo: mensagem; outroCampo: outra mensagem"`), não uma
lista estruturada — trate como texto único a ser exibido, não tente fazer
parsing por campo.

Status comuns: `400` (payload inválido), `401` (não autenticado / credenciais
inválidas / token expirado), `403` (autenticado mas sem permissão — ex.:
editar item de outro usuário), `404` (recurso não existe), `500` (erro
interno — reportar ao backend).

---

## 6. Gerando os tipos automaticamente

Os shapes acima foram escritos à mão para consulta rápida — a fonte da
verdade é sempre o código. Para tipos TypeScript sempre em dia com o backend
real (inclusive `required`/`minLength` de validação), veja `README-OPENAPI.md`:

```bash
curl -u "$SWAGGER_USERNAME:$SWAGGER_PASSWORD" http://localhost:8080/v3/api-docs -o openapi.json
npx openapi-typescript openapi.json -o src/types/api.d.ts
```
