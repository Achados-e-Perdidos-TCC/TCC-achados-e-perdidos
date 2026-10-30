# Arquitetura — Achados e Devolvidos (back-end refatorado)

Este documento explica **o que mudou** em relação ao código original e **por quê**,
com foco nos dois pedidos do refactor: desacoplamento máximo e schema de banco fora
da responsabilidade do Hibernate.

## 1. Estrutura de pacotes (por feature, um único pacote raiz)

```
com.achadosedevolvidos
├── auth/          # Bearer JWT: controller, service, filtro, DTOs
├── user/          # User, AuthenticatedUser, perfil (/users/me)
├── category/      # Categoria (entidade simples, CRUD de leitura)
├── item/          # Item, ItemImage, busca, DTOs, evento de criação
├── upload/        # Upload de imagens (multipart) para disco local
├── notification/  # Notificações criadas por evento (item/user)
├── config/        # Security, Async, beans de autenticação
└── shared/        # BaseEntity, exceções e resposta de erro padrão
```

Isso substitui a duplicidade original (`com.achadosedevolvidos.controller` vs
`com.example.api.controller`, ambos mapeando `/api/v1/items`) por um único
`ItemController`.

## 2. Quem cria o banco: Flyway, não o Hibernate

`spring.jpa.hibernate.ddl-auto` está em **`validate`** — o Hibernate só confere, na
subida da aplicação, se as entidades batem com o schema já existente. Ele nunca
cria, altera ou apaga uma tabela.

Quem efetivamente cria e versiona o schema é o **Flyway**
(`src/main/resources/db/migration/V1` a `V20`):

| Migration | Conteúdo |
|---|---|
| V1 | `users` |
| V2 | `categories` |
| V3 | `items` |
| V4 | `item_images` |
| V5 | `matches` |
| V6 | `messages` |
| V7 | seed de categorias iniciais (DML separado do DDL) |
| V8 | `refresh_tokens` |
| V9 | `password_reset_tokens` |
| V10/V11 | `short_description` obrigatória em `items`, e `description` deixa de aceitar `NULL` |
| V12 | `icon_url` em `categories` |
| V13 | remove a coluna `provider` de `users` (login via Google/OAuth2 removido) |
| V14 | `phone`/`city`/`avatar_url` em `users` (perfil, `GET/PATCH /users/me`) |
| V15 | `active` (boolean, default `true`) em `users` — soft delete de conta (`DELETE /users/me`) |
| V16 | `user_preferences` (tabela separada — `notifications_enabled`/`match_alerts_enabled`/`emails_enabled`, `PATCH /users/me/preferences`) |
| V17 | `notifications` (`/api/v1/notifications` — ver `README-BACKEND-ENDPOINTS.md`, seção 6) |
| V18 | popula `icon_url` nas 6 categorias semeadas pela V7 — ficavam `NULL` desde a V12 |
| V19 | **remove match e chat** (seção 3): dropa `messages`/`matches` e a coluna `match_alerts_enabled` de `user_preferences` |
| V20 | `show_email_on_items` em `user_preferences` (`emailResponsavel` no detalhe de item — seção 16) |

Vantagens diretas: histórico de mudanças de schema versionado e revisável em PR,
mesmo comportamento em dev/homologação/produção, e nenhuma surpresa de o Hibernate
"adivinhar" uma migração de coluna incorretamente.

## 3. Match e chat foram removidos do produto

O projeto teve, por um tempo, um motor de correspondência automática
(`match/`: ao cadastrar um item, comparava com candidatos do tipo oposto na
mesma categoria e sugeria possíveis correspondências) e um chat em tempo
real construído inteiramente em cima dele (`chat/`: cada mensagem pertencia
a um match — era o "ID da conversa"). Por decisão do time, os dois módulos
foram removidos por completo (chat saiu junto porque dependia 100% de
match, sem nenhuma tela de frontend construída sobre ele ainda).

O que vale registrar, mesmo com o código já removido: a arquitetura de
**desacoplamento por evento de domínio** que o motor de match motivou
originalmente (`ItemServiceImpl` nunca importava nada do pacote `match`, só
publicava um `ApplicationEvent` e seguia em frente) continua sendo o padrão
do projeto — hoje reaplicado entre `item`/`user` e `notification` (seção
14). Migration de remoção: `V19`.

## 4. Autenticação e autorização

Único mecanismo de login: Bearer JWT stateless (detalhes em `README-AUTH.md`).
O login social via Google/OAuth2 existiu numa versão anterior deste refactor e
foi removido do produto por decisão do time — o que resta abaixo já reflete
esse estado atual.

- **`ItemController.create()` corrigido**: lia `@RequestAttribute("userId")`, que
  nenhum filtro preenchia. Agora usa `@AuthenticationPrincipal AuthenticatedUser`.
- **API 100% stateless, CSRF desabilitado**: com o login via sessão/cookie
  (OAuth2) fora do produto, não sobra nenhum mecanismo de autenticação
  ambiente (cookie enviado automaticamente pelo navegador) — só resta o
  Bearer JWT, que exige o header `Authorization` ser montado explicitamente
  pelo cliente. `SecurityConfig` reflete isso: `sessionCreationPolicy(STATELESS)`
  e `.csrf(disable)`. Essa segurança depende de uma suposição que o backend
  não controla — o front-end nunca guardar o token num cookie automático —
  documentada com um alerta explícito em `README-AUTH.md` e no próprio
  `SecurityConfig`, pra não virar um buraco de segurança silencioso se a
  estratégia de armazenamento do token mudar no futuro.

## 5. Camadas e contratos (Controller → Service (interface) → Repository)

Todo Service de escrita tem uma interface (`ItemService`, `UserService`,
`NotificationService`) implementada por uma classe `*Impl` — os Controllers
dependem só da interface, então trocar a implementação (ou mockar em teste)
não exige tocar em mais nada. Exceção proposital: `CategoryController` fala direto com o repositório,
porque é uma listagem simples sem nenhuma regra de negócio — criar uma interface
de serviço ali seria cerimônia sem benefício.

## 6. Desacoplamento Controller ↔ query dinâmica

A busca de itens (`GET /api/v1/items/search`) usa `ItemSpecifications`
(Spring Data JPA Specification) em vez de um método de repositório com uma
combinatória de parâmetros opcionais. Cada filtro é uma `Specification` isolada e
combinável — o Controller e o Service não sabem como o filtro vira SQL.

> Busca por proximidade geográfica (lat/lng) ainda não filtra no banco — precisaria
> de PostGIS ou de uma expressão Haversine em SQL nativo. Preferi deixar isso como
> próximo passo documentado a entregar uma implementação aproximada/incorreta.

## 7. Entidades sem duplicação (`BaseEntity`)

`id` (UUID) e `createdAt` deixaram de ser redeclarados em cada entidade. Uma
`@MappedSuperclass` (`BaseEntity`) centraliza os dois campos, e `createdAt` é
preenchido sozinho via `@PrePersist` — nenhum Service precisa mais lembrar de
chamar `.createdAt(LocalDateTime.now())` na mão (o `AuthService`, por exemplo,
não faz mais isso).

## 8. `open-in-view: false` exige `@Transactional` explícito em toda leitura com relação lazy

`spring.jpa.open-in-view` está desligado de propósito (ver seção 2) — a sessão
do Hibernate não fica aberta pela duração inteira da requisição HTTP por
padrão. Isso só é seguro se **todo** método de Service que navega uma relação
`@ManyToOne`/`@OneToMany` preguiçosa estiver dentro de uma transação — inclusive
métodos de leitura, não só os de escrita. Faltou isso originalmente em quatro
lugares (`ItemServiceImpl.findById`/`search` e dois métodos de leitura dos
módulos match/chat, já removidos — seção 3), descoberto só ao escrever os
testes de integração com Postgres real (`mvn verify` — ver `README.md`,
seção 2.4): com mocks, a entidade "lazy" retornada nunca é um proxy de
verdade, então o teste unitário não pega esse tipo de erro.
`ItemServiceImpl.findById`/`search` têm `@Transactional(readOnly = true)`
até hoje por esse motivo.

## 9. Perfil de usuário (`user/`) segue o mesmo padrão do resto da API

`GET/PATCH /users/me` e `PATCH /users/me/password` não introduziram nenhum
conceito novo — reaproveitam o que já existia: `@AuthenticationPrincipal
AuthenticatedUser` pra identificar o usuário, `AppException` com `HttpStatus`
explícito, e a mesma lógica de segurança do reset de senha (revogar todos os
refresh tokens da conta) reaplicada na troca de senha autenticada. A
atualização de perfil é parcial por design (`UpdateProfileRequest` com todos
os campos opcionais — campo omitido no JSON permanece inalterado), o mesmo
padrão que `PATCH /items/{id}` (seção 10) usa.

## 10. Extensão do CRUD de `Item`: dono, soft delete e filtro combinado

- **Verificação de dono**: `PATCH /items/{id}`, `DELETE /items/{id}` e
  `PATCH /items/{id}/status` comparam `item.getUser().getId()` com o usuário
  autenticado e lançam `403` caso não bata — um helper simples
  (`ensureOwner`) em `ItemServiceImpl`, sem necessidade de nenhuma anotação
  de segurança a mais.
- **`DELETE` é soft delete**: em vez de apagar a linha, marca
  `status = INATIVO`, pra o item continuar visível no histórico do próprio
  dono mesmo depois de "excluído" da busca pública e do detalhe. Efeito
  colateral que a busca pública e o detalhe (`GET /items/{id}`) precisaram
  aprender: um item `INATIVO` passou a ser tratado como "não encontrado"
  (`404`) pra quem não é o dono, embora continue visível no
  `GET /items/me` do próprio dono.
- **Filtro combinado em `GET /items/me?status=`**: o front-end pediu um único
  filtro que mistura dois campos que no modelo são distintos — `type`
  (PERDIDO/ENCONTRADO, fixo desde a criação) e `status` (ANALISANDO/
  PROCURANDO/RESOLVIDO/INATIVO, evolui com o tempo).
  `ItemServiceImpl.parseCombinedStatusFilter` tenta o valor recebido primeiro
  como `ItemType`, depois como `ItemStatus`, e devolve `400` se não bater com
  nenhum dos dois — evita expor dois query params quando o front-end só
  precisa de um.

## 11. Upload de imagens (`upload/`): disco local com validação client-hostile

`POST /api/v1/uploads/images` grava em disco local via `FileStorageService`
— MVP deliberado (sem custo de conta externa), documentado como próximo
passo natural trocar por S3/R2 mantendo a mesma interface. As decisões de
segurança valem a pena registrar:

- **Nome do arquivo em disco é sempre gerado por UUID**, nunca derivado do
  nome original enviado pelo cliente — sozinho, isso já impede path
  traversal (`../../application.yml`) e sobrescrita por coincidência de nome.
- **Extensão escolhida a partir de uma tabela fixa** indexada pelo
  `Content-Type` declarado (só `image/jpeg|png|webp|gif` são aceitos) — nunca
  copiada do nome original. Um arquivo disfarçado (ex.: `.html` renomeado
  pra `.jpg`) é salvo e servido de volta com a extensão/Content-Type de
  imagem, então o navegador nunca o executa como script.
- **`/uploads/**` é público** (`WebConfig` expõe o diretório como recurso
  estático) — precisa ser, já que a URL devolvida aparece embutida em
  respostas públicas (busca e detalhe de item). Só o endpoint de *upload*
  (`POST /api/v1/uploads/images`) exige login, via a regra padrão
  `anyRequest().authenticated()` do `SecurityConfig`.

## 12. Testes automatizados

Cobertura completa (unitária + integração) descrita em `README.md`, seção 2.4.
Resumo: testes unitários (Mockito, sem Spring/banco) para os Services com
lógica de negócio; testes de integração (`@SpringBootTest` + Postgres real via
Testcontainers) cobrindo os endpoints REST (incluindo o CRUD completo de item
e o upload de imagens) e os fluxos assíncronos de notificação por evento
(item/perfil atualizado → evento → notificação criada). Pipeline de CI em
`.github/workflows/backend-ci.yml`.

## 13. Soft delete de conta e preferências de usuário (`user/`)

- **Preferências em tabela própria, não colunas em `users`**: `UserPreferences`
  é uma entidade separada (`@OneToOne` para `User` via `user_id` único),
  decisão deliberada em vez de simplesmente adicionar três colunas booleanas
  em `users` — mantém a tabela de autenticação enxuta e deixa mais natural
  crescer o conjunto de preferências no futuro sem mexer em `User`. A linha
  é criada sob demanda (find-or-create em `UserServiceImpl.updatePreferences`)
  na primeira chamada a `PATCH /users/me/preferences`; até lá, `GET /users/me`
  devolve os valores padrão (tudo habilitado) sem precisar de nenhuma linha
  no banco — `UserMapper.toPreferencesResponse` trata `null` como "ainda não
  configurado, usar default".
- **`DELETE /users/me` é soft delete, não hard delete**: mesma motivação do
  soft delete de `Item` (seção 10) — preserva histórico em vez de apagar.
  Em vez de apagar a linha, marca `active = false` em `User` e:
  1. Revoga todos os refresh tokens da conta (`RefreshTokenRepository.revokeAllByUserId`,
     mesmo mecanismo já usado por troca/reset de senha) — bloqueia
     `POST /auth/refresh` dali em diante.
  2. Marca todos os itens do usuário como `INATIVO`
     (`ItemRepository.updateStatusForAllByUserId`, um `UPDATE` em massa —
     não carrega os itens em memória um a um).
- **`active = false` precisa bloquear em DOIS pontos, não só no login**: uma
  conta desativada não pode continuar autenticada com um access token emitido
  *antes* da exclusão (JWT continua criptograficamente válido até expirar,
  independente do estado da conta no banco). Por isso a checagem de
  `User.isEnabled()` (agora retorna `active` em vez de sempre `true`) foi
  reforçada em dois lugares:
  1. **Login novo**: `DaoAuthenticationProvider` já checa `isEnabled()`
     sozinho antes de autenticar e lança `DisabledException` — só foi preciso
     ampliar `GlobalExceptionHandler` de `BadCredentialsException` para o
     supertipo `AuthenticationException`, senão a exceção caía no handler
     genérico e virava `500` em vez do `401` esperado.
  2. **Token já emitido**: `JwtAuthenticationFilter` validava só a assinatura/
     expiração do JWT (`jwtService.isTokenValid`) e nunca olhava o estado da
     conta — um usuário desativado continuava autenticado em qualquer
     requisição até o token expirar. Agora o filtro também exige
     `userDetails.isEnabled()` antes de popular o `SecurityContext`.

## 14. Notificações (`notification/`): criadas por evento, nunca por chamada direta

Não existe um `NotificationController` que outros módulos chamam — a geração
de notificação segue o mesmo desacoplamento por evento que o motor de match
motivou originalmente (seção 3), aplicado agora a duas origens diferentes:

- `ItemServiceImpl.updateStatus` publica `ItemStatusChangedEvent`.
- `UserServiceImpl.updateProfile` publica `ProfileUpdatedEvent`.

Cada evento vive no pacote do módulo que o publica (`item.event`,
`user.event`) — nenhum dos dois módulos importa nada de `notification`. Um
listener dedicado por evento, dentro de `notification.listener`, escuta e
cria a notificação, com `@Async("taskExecutor")` +
`@TransactionalEventListener(phase = AFTER_COMMIT)`: só roda depois do
commit de quem publicou, numa thread separada, e uma falha aqui nunca
derruba a ação original (só loga).

**Centralização da regra de preferência**: em vez de cada listener checar
`user_preferences` antes de chamar o Service, a checagem mora dentro de
`NotificationServiceImpl.create` — um único lugar decide se a notificação é
criada, respeitando `notificationsEnabled` (o interruptor geral). Sem isso,
a lógica de preferência se repetiria em cada listener.

Migration `V17` cria a tabela `notifications`. Shape de resposta (`id`,
`type`, `title`, `message`, `createdAt`, `read`) foi definido pelo mock que o
front-end já tinha construído (`UserNotifications.jsx`), não inventado do
lado do backend — mesmo cuidado já tomado com `ItemResponse`.

## 15. Rate limiting em `POST /api/v1/auth/login`

Duas defesas independentes, cada uma cobrindo um cenário que a outra não
cobre (ver javadoc de `LoginRateLimiter`):

- **Por IP** (`LoginRateLimitFilter`): limite largo/volumétrico (`60`
  tentativas por minuto, por padrão) — barra um único cliente inundando o
  endpoint. Registrado via `FilterRegistrationBean` escopado só a
  `/api/v1/auth/login` (não um `@Component` aplicado a toda rota por
  padrão), com `Ordered.HIGHEST_PRECEDENCE` — roda antes até da cadeia do
  Spring Security, então uma requisição já bloqueada aqui nunca chega a
  tocar JWT, Controller ou banco. Considera `X-Forwarded-For` (primeiro IP
  da lista) antes de `request.getRemoteAddr()`, necessário atrás de um
  proxy/load balancer.
- **Por e-mail** (dentro de `AuthService.login`): a defesa de verdade contra
  força bruta/credential stuffing numa conta específica, mesmo que as
  tentativas venham de IPs diferentes (`5` tentativas falhas por `15`
  minutos, por padrão). Só consome 1 tentativa do bucket quando a
  autenticação falha — um login certo de primeira nunca é penalizado — e
  **reseta** o contador da conta em caso de sucesso. A checagem
  (`isEmailRateLimited`) roda antes até de comparar a senha, então uma
  conta já no limite é rejeitada sem tocar no banco.

Implementado com `bucket4j-core` (token bucket) em memória — suficiente
para uma única instância da aplicação; numa implantação com múltiplas
instâncias, o limite só valeria por instância, não globalmente, a menos que
o backend dos buckets mude para algo compartilhado (ex.: Redis).

Os dois limites são configuráveis por variável de ambiente, nenhuma
obrigatória (todas com default) — ver `.env.example`.

## 16. `emailResponsavel` no detalhe de item: opt-in por preferência

`GET /api/v1/items/{id}` é público e sem autenticação — expor o e-mail do
dono incondicionalmente nesse endpoint faria dele um vetor de coleta em
massa (qualquer bot varrendo `GET /items/search`, também público, colheria
o e-mail de todo usuário que já publicou um item, pra sempre). Decisão
alinhada com o time antes de implementar:

- Nova preferência `showEmailOnItems` em `user_preferences` (migration
  `V20`), **default ligado** — quem publica um item perdido/achado
  normalmente quer ser contatado; quem se importa com privacidade desliga
  manualmente via `PATCH /users/me/preferences`.
- `emailResponsavel` só é resolvido em `ItemServiceImpl.findById` (o
  detalhe de um item específico) — `ItemMapper.toResponse(Item)` (usado por
  `search`, `findMine`, `create`, `update`, `updateStatus`) nunca recebe
  e-mail algum, mesmo sendo o mesmo `ItemResponse` em todos esses lugares.
  Um segundo overload, `toResponse(Item, String emailResponsavel)`, existe
  só para esse caso — o Mapper não decide a regra de exposição, só monta a
  resposta com o que `findById` já resolveu.
- Sem endpoint de envio de mensagem: o valor existe só para o front-end
  montar um link `mailto:` no formulário "Tenho informações sobre este
  objeto".

## 17. O que ainda fica para depois (fora do escopo deste refactor)

- Busca geográfica por raio (PostGIS).
- Trocar o storage de upload de disco local por S3/Cloudflare R2 (não
  sobrevive a um redeploy do container hoje).
