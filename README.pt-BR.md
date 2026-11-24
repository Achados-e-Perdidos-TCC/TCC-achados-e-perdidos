# Achados e Devolvidos (Lost & Found)

[English](README.md) | **Português (Brasil)**

> **Projeto acadêmico, não é um serviço real.**
> O Achados e Devolvidos é um **Trabalho de Conclusão de Curso (TCC)**, o projeto
> final do curso de Formação full stack Junior oferecido pela +PraTI em parceria com a Codifica Edu.
> Foi construído para fins de aprendizado e como peça de portfólio. Ele **não** é
> um serviço real nem comercial de achados e perdidos, não é operado por nem
> tem vínculo com nenhuma empresa, escola ou órgão público, e ninguém o
> monitora para recuperar objetos perdidos de verdade. Use apenas dados
> fictícios. Veja
> [Contexto acadêmico e aviso legal](#contexto-acadêmico-e-aviso-legal).

Uma plataforma web que ajuda uma comunidade a encontrar objetos perdidos. As
pessoas podem cadastrar itens que **perderam** ou **encontraram**, pesquisá-los
com filtros e receber notificações quando um item que cadastraram muda de
status.

**Demonstração (front-end):** <https://achados-e-devolvidos.vercel.app>. A API
está configurada para uma hospedagem gratuita (veja o `render.yaml`), então a
primeira requisição depois de um período sem uso pode demorar para responder.

<!-- Capturas de tela: adicione as imagens em docs/screenshots/ e referencie aqui. -->

A interface está disponível em português e em inglês. A documentação está
disponível nos dois idiomas (veja [Documentação](#documentação)).

## Meu papel

Fui o **líder da equipe** e o **desenvolvedor back-end**. Projetei e construí a
API REST (autenticação, itens, busca, notificações), as migrations do banco de
dados, a suíte de testes e o pipeline de CI. O front-end foi construído pelo
restante da equipe.

## Funcionalidades

- Cadastro (formulário em etapas), login, renovação de sessão e solicitação de
  redefinição de senha por e-mail
- Cadastro de itens perdidos ou encontrados com categoria, local, data,
  descrição e até 6 fotos
- Busca de itens por nome, local, categoria e período, filtrada por tipo
  (todos, perdidos ou encontrados)
- Detalhes do item com galeria de imagens e um formulário de contato que abre
  um rascunho de Gmail já preenchido para o dono (quando o dono permite exibir
  o e-mail)
- Gerenciamento dos próprios itens: edição e exclusão (exclusão lógica)
- Notificações dentro do app, com preferências por usuário
- Perfil do usuário com avatar, preferências, troca de senha e desativação da
  conta
- Interface em português e inglês, temas claro e escuro, layout responsivo

## Tecnologias

| Camada      | Tecnologia                                                        |
| ----------- | ----------------------------------------------------------------- |
| Front-end   | React 19, Vite 8, React Router 8, i18next                         |
| Back-end    | Java 21, Spring Boot 3.3, Spring Security 6, Spring Data JPA      |
| Banco       | PostgreSQL 16, migrations com Flyway                              |
| Auth        | JWT stateless (access + refresh tokens), rate limiting (Bucket4j) |
| Testes      | JUnit 5, Mockito, Testcontainers (back-end)                       |
| DevOps      | Docker, Docker Compose, GitHub Actions                            |
| Hospedagem  | Vercel (front-end), blueprint do Render para a API e o banco      |
| Docs da API | OpenAPI / Swagger UI                                              |

## Estrutura do projeto

```text
.
├── backend-refatorado/   API REST em Spring Boot, migrations Flyway, testes, Dockerfile
├── front-end/            Aplicação de página única em React + Vite
├── .github/workflows/    Pipeline de CI (back-end)
└── render.yaml           Blueprint do Render (API + PostgreSQL)
```

## Principais decisões técnicas

- **Pacotes por funcionalidade** (`auth`, `user`, `item`, `category`,
  `notification`, `upload`) em vez de um pacote por camada.
- **Schema do banco controlado pelo Flyway.** O Hibernate roda com
  `ddl-auto: validate`, então nunca altera tabelas por conta própria.
- **JWT stateless com rotação de refresh token.** Os refresh tokens ficam
  armazenados no servidor e podem ser revogados (no logout, na troca de senha
  e na redefinição de senha).
- **Proteção do login.** Rate limiting por IP e por conta, e um `401` genérico
  que não revela se um e-mail existe.
- **Notificações orientadas a eventos.** Mudanças em itens e no perfil
  publicam eventos de domínio, e o módulo de notificações os escuta, mantendo
  os módulos desacoplados.
- **Busca dinâmica com JPA Specifications.** Cada filtro é isolado e eles podem
  ser combinados livremente.
- **Exclusão lógica (soft delete)** para itens e contas, para que nenhum dado
  se perca por acidente.
- **Uploads seguros.** Só são aceitos tipos de imagem, há um limite de 5 MB e
  os arquivos são gravados com nomes gerados (UUID), nunca com o nome original.

Mais detalhes estão em
[`backend-refatorado/ARQUITETURA.md`](backend-refatorado/ARQUITETURA.md).

## Visão geral da API

Caminho base: `/api/v1`. A documentação interativa fica em `/swagger-ui`
(protegida com Basic Auth).

| Área         | Endpoints                                                                                                                                                               |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth         | `POST /auth/register`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password`                                                                           |
| Usuários     | `GET/PATCH/DELETE /users/me`, `PATCH /users/me/password`, `PATCH /users/me/preferences`                                                                                 |
| Itens        | `POST /items`, `GET /items/search`, `GET /items/{id}`, `GET /items/me`, `PATCH /items/{id}`, `PATCH /items/{id}/status`, `PATCH /items/{id}/type`, `DELETE /items/{id}` |
| Categorias   | `GET /categories`                                                                                                                                                       |
| Notificações | `GET /notifications`, `PATCH /notifications/{id}/read`, `PATCH /notifications/read-all`                                                                                 |
| Uploads      | `POST /uploads/images`                                                                                                                                                  |

## Como executar

### Requisitos

Java 21, Maven 3.9+, Node.js 22.22 ou superior (exigido pelo React Router 8) e
Docker.

### 1. Back-end

```bash
cd backend-refatorado
cp .env.example .env        # depois preencha os valores (veja abaixo)
docker compose up -d        # sobe o PostgreSQL
set -a && source .env && set +a
mvn spring-boot:run         # API em http://localhost:8080
```

O arquivo `.env` precisa, no mínimo, de `JWT_SECRET` (gere um com
`openssl rand -base64 32`), das credenciais SMTP usadas no e-mail de
redefinição de senha (por exemplo, uma caixa gratuita do Mailtrap) e do
usuário e senha do Basic Auth do Swagger. A aplicação não sobe sem eles.
Nunca faça commit do seu `.env`. A lista completa de variáveis está em
[`backend-refatorado/README.pt-BR.md`](backend-refatorado/README.pt-BR.md).

### 2. Front-end

```bash
cd front-end
npm install
echo "VITE_API_BASE_URL=http://localhost:8080/api/v1" > .env
npm run dev                 # http://localhost:5173
```

Mais detalhes em [`front-end/README.pt-BR.md`](front-end/README.pt-BR.md).

## Testes

```bash
cd backend-refatorado
mvn test                                  # testes unitários (não precisam de Docker)
mvn verify -Dskip.unit.tests=true         # testes de integração (precisam de Docker)
```

Os testes unitários cobrem o serviço de JWT, o serviço de autenticação, o
serviço de itens e o limitador de tentativas de login. Os testes de integração
rodam contra um PostgreSQL real iniciado pelo Testcontainers e cobrem os
endpoints de autenticação, itens, categorias, usuário, notificações e upload,
além de CORS e do rate limiting do login.

O front-end ainda não tem testes automatizados.

## Integração contínua

Um workflow do GitHub Actions (`.github/workflows/backend-ci.yml`) compila o
back-end e roda os testes unitários e de integração em paralelo a cada push e
pull request para `main` e `backend-develop`. Ainda não há workflow para o
front-end.

## Documentação

| Assunto                                 | English                                                      | Português (Brasil)                                                            |
| --------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Visão geral do projeto                  | [README.md](README.md)                                       | [README.pt-BR.md](README.pt-BR.md)                                            |
| Front-end                               | [front-end/README.md](front-end/README.md)                   | [front-end/README.pt-BR.md](front-end/README.pt-BR.md)                        |
| Back-end (setup, variáveis, testes, CI) | [backend-refatorado/README.md](backend-refatorado/README.md) | [backend-refatorado/README.pt-BR.md](backend-refatorado/README.pt-BR.md)      |
| Decisões de arquitetura                 | Somente em português                                         | [ARQUITETURA.md](backend-refatorado/ARQUITETURA.md)                           |
| Detalhes de autenticação                | Somente em português                                         | [README-AUTH.md](backend-refatorado/README-AUTH.md)                           |
| Catálogo de endpoints                   | Somente em português                                         | [README-BACKEND-ENDPOINTS.md](backend-refatorado/README-BACKEND-ENDPOINTS.md) |
| Guia de integração da API para o front  | Somente em português                                         | [README-FRONTEND.md](backend-refatorado/README-FRONTEND.md)                   |
| OpenAPI / Swagger                       | Somente em português                                         | [README-OPENAPI.md](backend-refatorado/README-OPENAPI.md)                     |
| Setup da equipe de back-end             | Somente em português                                         | [README-BACKEND-SETUP.md](backend-refatorado/README-BACKEND-SETUP.md)         |

## Limitações conhecidas e próximos passos

- **A redefinição de senha está incompleta na interface.** A API envia o e-mail
  e expõe `POST /auth/reset-password`, mas a tela do front-end em que a pessoa
  escolhe a nova senha (o link `/reset-password?token=...` do e-mail) ainda
  não foi implementada.
- **As páginas de Termos de Uso e Política de Privacidade não existem.** O
  formulário de cadastro aponta para elas, e os links levam à tela de "página
  não encontrada".
- **A busca roda no navegador.** O front-end chama `GET /items/search` uma vez,
  sem parâmetros (por isso recebe só os 20 itens mais recentes), e depois
  filtra e pagina localmente. A API já suporta filtros e paginação no
  servidor; o front-end deveria usá-los.
- **O status e o tipo do item não podem ser alterados pela interface.**
  `PATCH /items/{id}/status` e `/type` existem apenas na API.
- As imagens enviadas ficam em disco local. Em hospedagens com disco efêmero,
  como a gratuita usada na demonstração, elas não sobrevivem a um novo deploy.
  Um serviço de armazenamento em nuvem (S3 ou Cloudflare R2) seria o próximo
  passo.
- A busca por raio geográfico ainda não foi implementada (`lat` e `lng` estão
  reservados na API).
- O front-end não tem testes automatizados nem workflow de CI e é escrito em
  JavaScript; está planejada uma migração gradual para TypeScript.
- Um motor de correspondência automática e um chat em tempo real foram
  construídos e depois removidos por decisão da equipe.

## Contexto acadêmico e aviso legal

**O que é.** O Achados e Devolvidos é o projeto de conclusão de curso (**Trabalho
de Conclusão de Curso, TCC**) de uma equipe de estudantes do curso de Formação full stack Junior oferecido pela +PraTI em parceria com a Codifica Edu. O objetivo é demonstrar
habilidades de engenharia de software: uma API REST com autenticação, um banco
de dados relacional com migrations, testes automatizados, CI e um front-end de
página única.

**O que não é.**

- Não é um serviço real, comercial ou oficialmente em operação de achados e
  perdidos.
- Não é operado, endossado nem tem vínculo com nenhuma empresa, escola,
  empresa de transporte ou órgão público, nem com qualquer outro produto ou
  serviço que use um nome parecido.
- Ninguém monitora a plataforma, então não conte com ela para recuperar
  objetos de verdade.

**Se você for testar a demonstração.**

- Use apenas dados fictícios. Não informe dados pessoais reais, documentos de
  identificação, fotos de pessoas nem qualquer informação sensível.
- A demonstração é oferecida como está, sem garantia de disponibilidade,
  suporte ou segurança. Os dados podem ser reiniciados ou removidos a qualquer
  momento.
- O projeto não tem termos legais nem política de privacidade, e não passou
  por auditoria de segurança nem por adequação à LGPD.
