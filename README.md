# Achados e Devolvidos (Lost & Found)

**English** | [Português (Brasil)](README.pt-BR.md)

> **Academic project, not a real service.**
> _> Achados e Devolvidos is a final project developed as part of the
> _> Junior Full Stack Developer training program offered by +PraTI in
> _> partnership with Codifica Edu. It was built for learning and as a
> _> portfolio piece. It is **not** a real or commercial lost-and-found
> _> service, it is not operated by or affiliated with any company, school
> _> or public body, and nobody monitors it for real lost items. Please
> \*> use fictitious data only. See
> [Academic context and disclaimer](#academic-context-and-disclaimer).

A web platform that helps a community find lost belongings. People can post
items they **lost** or **found**, search them with filters, and get notified
when an item they posted changes status.

**Live demo (front-end):** <https://achados-e-devolvidos.vercel.app>. The API
is set up for a free hosting tier (see `render.yaml`), so the first request
after a period of inactivity can take a while to respond.

<!-- Screenshots: add images to docs/screenshots/ and reference them here. -->

The user interface is available in Portuguese and English. The documentation is
available in both languages (see [Documentation](#documentation)).

## My role

I was the **team lead** and the **back-end developer**. I designed and built
the REST API (authentication, items, search, notifications), the database
migrations, the test suite and the CI pipeline. The front-end was built by
the rest of the team.

## Features

- Sign up (multi-step form), log in, refresh sessions and request a password
  reset by e-mail
- Post lost or found items with category, location, date, description and up
  to 6 photos
- Search items by name, location, category and date range, filtered by type
  (all, lost or found)
- Item details with an image gallery and a contact form that opens a
  pre-filled Gmail draft to the owner (when the owner allows showing their
  e-mail)
- Manage your own items: edit and delete (soft delete)
- In-app notifications, with per-user preferences
- User profile with avatar, preferences, password change and account
  deactivation
- Portuguese and English interface, light and dark themes, responsive layout

## Tech stack

| Layer     | Technology                                                      |
| --------- | --------------------------------------------------------------- |
| Front-end | React 19, Vite 8, React Router 8, i18next                       |
| Back-end  | Java 21, Spring Boot 3.3, Spring Security 6, Spring Data JPA    |
| Database  | PostgreSQL 16, Flyway migrations                                |
| Auth      | Stateless JWT (access + refresh tokens), Bucket4j rate limiting |
| Tests     | JUnit 5, Mockito, Testcontainers (back-end)                     |
| DevOps    | Docker, Docker Compose, GitHub Actions                          |
| Hosting   | Vercel (front-end), Render blueprint for the API and database   |
| API docs  | OpenAPI / Swagger UI                                            |

## Project structure

```text
.
├── backend-refatorado/   Spring Boot REST API, Flyway migrations, tests, Dockerfile
├── front-end/            React + Vite single-page application
├── .github/workflows/    CI pipeline (back-end)
└── render.yaml           Render blueprint (API + PostgreSQL)
```

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

| Area          | Endpoints                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth          | `POST /auth/register`, `/login`, `/refresh`, `/logout`, `/forgot-password`, `/reset-password`                                                                           |
| Users         | `GET/PATCH/DELETE /users/me`, `PATCH /users/me/password`, `PATCH /users/me/preferences`                                                                                 |
| Items         | `POST /items`, `GET /items/search`, `GET /items/{id}`, `GET /items/me`, `PATCH /items/{id}`, `PATCH /items/{id}/status`, `PATCH /items/{id}/type`, `DELETE /items/{id}` |
| Categories    | `GET /categories`                                                                                                                                                       |
| Notifications | `GET /notifications`, `PATCH /notifications/{id}/read`, `PATCH /notifications/read-all`                                                                                 |
| Uploads       | `POST /uploads/images`                                                                                                                                                  |

## Getting started

### Requirements

Java 21, Maven 3.9+, Node.js 22.22 or newer (required by React Router 8) and
Docker.

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
your `.env` file. The full list of variables is in
[`backend-refatorado/README.md`](backend-refatorado/README.md).

### 2. Front-end

```bash
cd front-end
npm install
echo "VITE_API_BASE_URL=http://localhost:8080/api/v1" > .env
npm run dev                 # http://localhost:5173
```

More details are in [`front-end/README.md`](front-end/README.md).

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

The front-end has no automated tests yet.

## Continuous integration

A GitHub Actions workflow (`.github/workflows/backend-ci.yml`) compiles the
back-end and runs the unit and integration tests in parallel on every push
and pull request to `main` and `backend-develop`. There is no workflow for the
front-end yet.

## Documentation

| Topic                                   | English                                                      | Português (Brasil)                                                            |
| --------------------------------------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------- |
| Project overview                        | [README.md](README.md)                                       | [README.pt-BR.md](README.pt-BR.md)                                            |
| Front-end                               | [front-end/README.md](front-end/README.md)                   | [front-end/README.pt-BR.md](front-end/README.pt-BR.md)                        |
| Back-end (setup, variables, tests, CI)  | [backend-refatorado/README.md](backend-refatorado/README.md) | [backend-refatorado/README.pt-BR.md](backend-refatorado/README.pt-BR.md)      |
| Architecture decisions                  | Portuguese only                                              | [ARQUITETURA.md](backend-refatorado/ARQUITETURA.md)                           |
| Authentication details                  | Portuguese only                                              | [README-AUTH.md](backend-refatorado/README-AUTH.md)                           |
| Endpoint catalog                        | Portuguese only                                              | [README-BACKEND-ENDPOINTS.md](backend-refatorado/README-BACKEND-ENDPOINTS.md) |
| API integration guide for the front-end | Portuguese only                                              | [README-FRONTEND.md](backend-refatorado/README-FRONTEND.md)                   |
| OpenAPI / Swagger                       | Portuguese only                                              | [README-OPENAPI.md](backend-refatorado/README-OPENAPI.md)                     |
| Back-end team setup                     | Portuguese only                                              | [README-BACKEND-SETUP.md](backend-refatorado/README-BACKEND-SETUP.md)         |

## Known limitations and next steps

- **Password reset is incomplete in the UI.** The API sends the reset e-mail
  and exposes `POST /auth/reset-password`, but the front-end screen where the
  user chooses a new password (the `/reset-password?token=...` link in the
  e-mail) is not implemented yet.
- **Terms of Use and Privacy Policy pages do not exist.** The sign-up form
  links to them, and the links lead to the "page not found" screen.
- **Search runs in the browser.** The front-end requests `GET /items/search`
  once, without parameters (so it receives only the 20 most recent items), then
  filters and paginates locally. The API already supports server-side filters
  and pagination; the front-end should use them.
- **Item status and type cannot be changed from the UI.** `PATCH
/items/{id}/status` and `/type` exist in the API only.
- Uploaded images are stored on local disk. On hosting with an ephemeral disk,
  such as the free tier used for the demo, they do not survive a redeploy. A
  cloud storage service (S3 or Cloudflare R2) would be the next step.
- Search by geographic radius is not implemented yet (`lat` and `lng` are
  reserved in the API).
- The front-end has no automated tests, has no CI workflow and is written in
  JavaScript; a gradual migration to TypeScript is planned.
- An automatic match engine and a real-time chat were built and later removed
  by team decision.

## Academic context and disclaimer

**What this is.** Achados e Devolvidos is the final project of a team of students in the Junior Full Stack Developer training program offered by +PraTI in partnership with Codifica Edu. Its goal is to demonstrate software engineering skills: a REST API with authentication, a relational database with migrations, automated tests, CI and a single-page front-end.

**What this is not.**

- It is not a real, commercial or officially operating lost-and-found service.
- It is not operated by, endorsed by or affiliated with any company, school,
  transport agency or public body, nor with any other product or service that
  uses a similar name.
- Nobody monitors the platform, so do not rely on it to recover real belongings.

**If you try the demo.**

- Use fictitious data only. Do not enter real personal data, identity
  documents, photos of people or any sensitive information.
- The demo is provided as is, without any guarantee of availability, support
  or security. Its data can be reset or removed at any time.
- The project has no legal terms or privacy policy, and it has not been through
  a security audit or a data protection (LGPD) review.
