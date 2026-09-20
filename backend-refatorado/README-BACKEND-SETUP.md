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

# Stack e Setup — Achados e Devolvidos (equipe de backend)

Linguagem, dependências e ferramentas que precisam estar instaladas na
máquina para rodar e desenvolver o backend. Passo a passo completo de
instalação (Windows/macOS/Linux) e configuração fica em `README.md`, seções
1 e 2 — este documento é a referência rápida de **o quê** instalar e **por
quê**, não o tutorial de instalação em si.

---

## 1. Linguagem e stack principal

| Item | Versão | Observação |
|---|---|---|
| **Java** | **21** (LTS) | Qualquer distribuição de JDK 21 funciona (Corretto, Temurin, Oracle JDK). |
| **Spring Boot** | **3.3.4** | Gerencia (via BOM) a versão da maioria das dependências abaixo — não fixe versão manualmente nelas a menos que exista um motivo documentado (ver `testcontainers.version` no `pom.xml`, único override hoje). |
| **Spring Security** | 6.x (via Spring Boot) | Bearer JWT stateless — sem sessão, sem cookie. |
| **Spring Data JPA / Hibernate** | 6.x (via Spring Boot) | `ddl-auto: validate` — o Hibernate nunca cria/altera tabela sozinho. |
| **PostgreSQL** | **16** | Roda em container Docker (`docker-compose.yml`), não precisa instalar localmente. |
| **Flyway** | via Spring Boot | Dono do schema — todo `CREATE`/`ALTER TABLE` é uma migration versionada em `src/main/resources/db/migration`. |
| **Maven** | **3.10.0-rc-1** (ou qualquer 3.9.x estável, ver `README.md` seção 1.2) | Build tool do projeto. |
| **Lombok** | via Spring Boot | `@Getter`/`@Setter`/`@Builder`/`@SuperBuilder`/`@RequiredArgsConstructor` — praticamente todo `model`/`service` usa. Precisa do plugin do Lombok habilitado na IDE. |

---

## 2. Ferramentas que precisam estar instaladas na máquina

1. **JDK 21** — `java -version` deve mostrar `21...`.
2. **Maven 3.10.0-rc-1** (ou 3.9.x) — `mvn -version` deve bater com o Java
   detectado acima.
3. **Docker Desktop** (Windows/macOS) ou `docker-ce` + `docker-compose-plugin`
   (Linux) — necessário para:
   - Subir o Postgres de desenvolvimento (`docker compose up -d`).
   - Rodar os testes de integração (`mvn verify`), que sobem um Postgres real
     via **Testcontainers** — sem Docker rodando, `mvn verify` falha na
     subida do container, não só os testes que dependem de banco.
4. **Git**.
5. **IDE com suporte a Lombok** — IntelliJ IDEA (plugin Lombok, geralmente já
   vem habilitado) ou VS Code com a extensão "Lombok Annotations Support".

Passo a passo de instalação de cada um (Windows/macOS/Linux) está em
`README.md`, seção 1 — inclusive links de download e comandos exatos.

---

## 3. Dependências do projeto (`pom.xml`) e para que servem

| Dependência | Versão | Para que serve |
|---|---|---|
| `spring-boot-starter-web` | (BOM) | REST/MVC. |
| `spring-boot-starter-websocket` | (BOM) | WebSocket/STOMP do chat em tempo real. |
| `spring-boot-starter-mail` | (BOM) | Envio de e-mail (fluxo de esqueci-minha-senha). |
| `spring-boot-starter-data-jpa` | (BOM) | JPA/Hibernate. |
| `postgresql` (driver) | (BOM) | Driver JDBC do Postgres. |
| `flyway-core` + `flyway-database-postgresql` | (BOM) | Migrations de schema. |
| `spring-boot-starter-validation` | (BOM) | `@Valid`/Bean Validation nos DTOs (`@NotBlank`, `@Email`, `@Size`, etc.). |
| `springdoc-openapi-starter-webmvc-ui` | 2.6.0 | Gera a spec OpenAPI e o Swagger UI em runtime, sem YAML escrito à mão — ver `README-OPENAPI.md`. |
| `spring-boot-starter-security` | (BOM) | Bearer JWT, único mecanismo de login. |
| `jjwt-api` / `jjwt-impl` / `jjwt-jackson` | 0.12.6 | Geração/validação dos tokens JWT (`JwtService`). |
| `lombok` | (BOM) | Reduz boilerplate (getters/setters/builders/construtores). |
| `spring-boot-starter-test` | (BOM, escopo `test`) | JUnit 5, Mockito, AssertJ, MockMvc. |
| `spring-security-test` | (BOM, escopo `test`) | Utilitários de teste do Spring Security. |
| `spring-boot-testcontainers` + `testcontainers:junit-jupiter` + `testcontainers:postgresql` | `1.21.4` (override — ver comentário no `pom.xml`) | Postgres real em container Docker para os testes de integração (`*IT.java`), em vez de H2/banco em memória. |
| `awaitility` | (BOM, escopo `test`) | Espera assíncrona sem `Thread.sleep` fixo (ex.: aguardar o listener `@Async` do motor de match). |
| `greenmail-junit5` | 2.0.1 (escopo `test`) | Servidor SMTP fake em memória — testes do fluxo de esqueci-minha-senha capturam o e-mail de verdade, sem depender do Mailtrap real. |

Não é necessário instalar nenhuma dessas manualmente — `mvn compile`/`mvn test`
baixa tudo do repositório Maven na primeira execução.

---

## 4. Configuração local mínima

```bash
cd backend-refatorado
cp .env.example .env      # preencha JWT_SECRET, SWAGGER_USERNAME/PASSWORD (sem
                           # default — a aplicação não sobe sem eles) e,
                           # se for testar reset de senha, MAIL_USERNAME/PASSWORD
docker compose up -d      # sobe o Postgres de desenvolvimento
```

`.env` nunca é commitado (já está no `.gitignore`) — detalhes de cada
variável, por que cada uma é sensível e como gerar o `JWT_SECRET` estão em
`README.md`, seção 2.1.

---

## 5. Comandos do dia a dia

```bash
mvn compile                           # só compila
mvn test                              # testes unitários (Mockito, sem Docker/banco)
mvn verify                            # unitários + integração (precisa do Docker rodando)
mvn verify -Dskip.unit.tests=true     # só os de integração

set -a && source .env && set +a && mvn spring-boot:run   # roda a aplicação (http://localhost:8080)
```

Detalhes de cada suíte de teste (o que cada uma cobre) em `README.md`, seção
2.4. Pipeline de CI (o que roda automaticamente em cada push/PR) em
`README.md`, seção 3.

---

## 6. Onde ler mais

- **`README.md`** — passo a passo completo de instalação e setup, do zero.
- **`ARQUITETURA.md`** — o porquê de cada decisão estrutural do projeto.
- **`README-BACKEND-ENDPOINTS.md`** — catálogo de endpoints implementados e
  pendentes.
- **`README-AUTH.md`** — detalhamento do mecanismo de autenticação.
- **`README-OPENAPI.md`** — geração de tipos TypeScript para o front-end.
- **`README-FRONTEND.md`** — guia de integração para quem consome a API.
