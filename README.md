# Achados e Devolvidos (Lost & Found)

A web platform that helps a community find lost belongings. People can post
items they **lost** or **found**, search them with filters, and get notified
when an item they posted changes status.

Built as a team capstone project for the Systems Analysis and Development
program (Unisinos / +PraTI). The user interface is in Portuguese; the
documentation is in English.

## My role

I was the **team lead** and the **back-end developer**. I designed and built
the REST API (authentication, items, search, notifications), the database
migrations, the test suite and the CI pipeline. The front-end was built by
the rest of the team.

## Features

- Sign up, log in, refresh sessions and reset a forgotten password by e-mail
- Post lost or found items with category, location, date and images
- Search items with combined filters: type, category, text, state, city,
  neighborhood and date range (paginated)
- Manage your own items: edit, change status, soft delete
- In-app notifications, with per-user preferences
- User profile with preferences and account deactivation

## Tech stack

| Layer     | Technology                                                      |
| --------- | --------------------------------------------------------------- |
| Front-end | React 19, Vite, React Router                                    |
| Back-end  | Java 21, Spring Boot 3.3, Spring Security 6, Spring Data JPA    |
| Database  | PostgreSQL 16, Flyway migrations                                |
| Auth      | Stateless JWT (access + refresh tokens), Bucket4j rate limiting |
| Tests     | JUnit 5, Mockito, Testcontainers                                |
| DevOps    | Docker, Docker Compose, GitHub Actions                          |
| API docs  | OpenAPI / Swagger UI                                            |

## Key technical decisions

- **Feature-based packages** (`auth`, `user`, `item`, `category`,
  `notification`, `upload`) instead of one package per layer.
- **Database schema owned by Flyway.** Hibernate runs with `ddl-auto: validate`,
  so it never changes tables on its own.
- **Stateless JWT with refresh-token rotation.** Refresh tokens are stored on
  the server and can be revoked (on logout, password change and password reset).
- **Login protection.** Rate limiting by IP and by account, and a generic
  `401` that does not reveal whether an e-mail exists.
- **Event-driven notifications.** Item and profile changes publish domain
  events, and the notification module listens to them, so the modules stay
  decoupled.
- **Dynamic search with JPA Specifications.** Each filter is isolated and
  they can be combined freely.
- **Soft delete** for items and accounts, so no data is lost by accident.
- **Safe uploads.** Only image types are accepted, there is a 5 MB limit, and
  files are stored under generated UUID names (never the original name).

More detail (in Portuguese) is in
[`backend-refatorado/ARQUITETURA.md`](backend-refatorado/ARQUITETURA.md).

## API overview

Base path: `/api/v1`. Interactive docs are available at `/swagger-ui`
(protected with Basic Auth).

| Area          | Endpoints                                                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth          | `POST /auth/register`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password`                                                 |
| Users         | `GET/PATCH/DELETE /users/me`, `PATCH /users/me/password`, `PATCH /users/me/preferences`                                                       |
| Items         | `POST /items`, `GET /items/search`, `GET /items/{id}`, `GET /items/me`, `PATCH /items/{id}`, `PATCH /items/{id}/status`, `DELETE /items/{id}` |
| Categories    | `GET /categories`                                                                                                                             |
| Notifications | `GET /notifications`, `PATCH /notifications/{id}/read`, `PATCH /notifications/read-all`                                                       |
| Uploads       | `POST /uploads/images`                                                                                                                        |

## Getting started

### Requirements

Java 21, Maven 3.9+, Node.js (current LTS) and Docker.

### 1. Back-end

```bash
cd backend-refatorado
cp .env.example .env        # then fill in the values (see below)
docker compose up -d        # starts PostgreSQL
set -a && source .env && set +a
mvn spring-boot:run         # API at http://localhost:8080
```

The `.env` file needs at least `JWT_SECRET` (generate one with
`openssl rand -base64 32`), the SMTP credentials used by the password-reset
e-mail (for example a free Mailtrap sandbox), and the Swagger Basic Auth
username and password. The app will not start without them. Never commit
your `.env` file.

### 2. Front-end

```bash
cd front-end
npm install
echo "VITE_API_BASE_URL=http://localhost:8080/api/v1" > .env
npm run dev                 # http://localhost:5173
```

## Tests

```bash
cd backend-refatorado
mvn test                                  # unit tests (no Docker needed)
mvn verify -Dskip.unit.tests=true         # integration tests (needs Docker)
```

Unit tests cover the JWT service, the auth service, the item service and the
login rate limiter. Integration tests run against a real PostgreSQL started by
Testcontainers and cover the auth, item, category, user, notification and
upload endpoints, CORS and login rate limiting.

## Continuous integration

A GitHub Actions workflow (`.github/workflows/backend-ci.yml`) compiles the
back-end and runs the unit and integration tests in parallel on every push
and pull request to `main` and `backend-develop`.

## Known limitations and next steps

- Uploaded images are stored on local disk. A cloud storage service (S3 or
  Cloudflare R2) would be the next step.
- Search by geographic radius is not implemented yet.
- The front-end has no automated tests yet and is written in JavaScript; a
  gradual migration to TypeScript is planned.
- An automatic match engine and a real-time chat were built and later removed
  by team decision.

## More documentation (Portuguese)

- [`backend-refatorado/README.md`](backend-refatorado/README.md): full backend setup
- [`backend-refatorado/README-BACKEND-ENDPOINTS.md`](backend-refatorado/README-BACKEND-ENDPOINTS.md): endpoint catalog
- [`backend-refatorado/README-AUTH.md`](backend-refatorado/README-AUTH.md): authentication details
- [`backend-refatorado/ARQUITETURA.md`](backend-refatorado/ARQUITETURA.md): architecture decisions

## Contributing

`main` and `backend-develop` are protected branches. Work on a branch named
`feature/<task>` (back-end), `feat/<task>` (front-end) or `fix/<task>`, and
open a pull request that needs at least one approval.
