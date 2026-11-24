# Achados e Devolvidos: Front-end

**English** | [Português (Brasil)](README.pt-BR.md)

> **Academic project, not a real service.** This is the front-end of a
> _Trabalho de Conclusão de Curso_ (TCC, capstone project) built for learning
> and as a portfolio piece. It is not a real lost-and-found service and has no
> affiliation with any company or institution. Use fictitious data only. See the
> [project README](../README.md#academic-context-and-disclaimer).

Single-page application (React + Vite) for **Achados e Devolvidos**, a
platform where people post, search and recover lost and found items. This
document covers only the front-end. The API is documented in
[`../backend-refatorado/README.md`](../backend-refatorado/README.md).

## Features and pages

| Route                          | Access     | Description                                         |
| ------------------------------ | ---------- | --------------------------------------------------- |
| `/`                            | Public     | Landing page with the 4 most recent items.          |
| `/buscar-objetos`              | Public     | Search and list items, with filters and pagination. |
| `/buscar-objetos/:id`          | Public     | Item details, image gallery and contact form.       |
| `/como-funciona`               | Public     | "How it works" page.                                |
| `/auth/login`                  | Public     | Log in (with a "remember me" option).               |
| `/auth/register`               | Public     | Multi-step sign-up.                                 |
| `/auth/forgot-password`        | Public     | Request a password-reset e-mail.                    |
| `/cadastrar-objetos`           | Restricted | Post a lost or found item.                          |
| `/user-area`                   | Restricted | Profile, "My items" and notifications.              |
| `/user-area/editar-objeto/:id` | Restricted | Edit or delete one of your items.                   |
| `/user-area/change-password`   | Restricted | Change the account password.                        |

Restricted routes are wrapped in `PrivateRoute`. Without a stored access token,
the app shows the "not authenticated" screen instead of the page.

## Tech stack

| Technology              | Use                                                     |
| ----------------------- | ------------------------------------------------------- |
| React 19                | Component-based UI.                                     |
| Vite 8                  | Dev server and production build.                        |
| React Router 8          | Routing and nested layouts.                             |
| i18next + react-i18next | Portuguese and English translations.                    |
| React IMask             | Input masks in forms.                                   |
| React DatePicker        | Date and period selection.                              |
| Fetch API               | HTTP client (wrapped in `src/lib/api/api.js`).          |
| Plain CSS               | Styles next to each component, plus CSS variables.      |
| ESLint                  | Static analysis (`eslint-plugin-react-hooks` included). |

Exact versions are in `package.json` and `package-lock.json`.

## Getting started

**Requirements:** Node.js 22.22 or newer (required by React Router 8), npm,
and a running instance of the API.

```bash
cd front-end
npm install                 # or "npm ci" to follow the lock file exactly
cp .env.example .env        # then set the API URL
npm run dev                 # http://localhost:5173
```

The only environment variable is the API base URL:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Variables prefixed with `VITE_` are embedded in the browser bundle, so never put
secrets in them.

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm run dev`     | Starts the Vite development server.        |
| `npm run build`   | Builds the production bundle into `dist/`. |
| `npm run preview` | Serves the production build locally.       |
| `npm run lint`    | Runs ESLint.                               |

## Project structure

```text
front-end/
├── public/                     Static files (favicon)
├── src/
│   ├── assets/                 Images and icons (category icons in assets/icons/categorias)
│   ├── components/             Shared components
│   │   ├── Header/             Header and main navigation
│   │   ├── LanguageSwitcher/   PT / EN toggle
│   │   ├── filter/             Primary filters, dropdown and date range
│   │   ├── loading/
│   │   └── status/             Lost / found status badge
│   ├── contexts/               React contexts
│   │   ├── authContexts/       Authentication state
│   │   └── filterContexts/     Search filter state (useReducer)
│   ├── hooks/filters/          Hook to read the filter context
│   ├── i18n/                   i18next setup and locales/{pt,en}.json
│   ├── lib/api/                HTTP client (api.js) and endpoints (endpoints.js)
│   ├── modules/                Features, each with pages, components, routes and services
│   │   ├── auth/               Login, sign-up and forgot password
│   │   ├── buscar-objetos/     Search
│   │   ├── cadastrar-objetos/  Post an item
│   │   ├── como-funciona/      How it works
│   │   ├── detalhes-objeto/    Item details
│   │   ├── home/               Landing page
│   │   └── private/            Authenticated area (user, edit item, change password)
│   ├── pages/errors/           Error and empty states
│   ├── routes/                 Route composition (Routes.jsx) and PrivateRoute.jsx
│   ├── styles/                 global.css and variables.css
│   └── utils/                  Helpers (categories, date, filters, images, inputs, location, validators)
├── index.html
├── vercel.json                 SPA fallback rewrite for Vercel
├── vite.config.js
└── eslint.config.js
```

## How it works

### Routing and layout

`src/main.jsx` mounts the router. `src/App.jsx` is the shared layout: it
provides the auth context, renders the header and an `Outlet`, and holds the
theme state. Each module exports its own route object, and `src/routes/Routes.jsx`
joins them. Unknown URLs fall back to the "not found" page.

### State management

- **Authentication.** `AuthProvider` exposes `isAuthenticated`, initialized by
  checking for an access token in `localStorage` or `sessionStorage`.
- **Search filters.** `FilterProvider` uses `useReducer` with three actions:
  `add` (secondary filter: all, lost, found), `change` (primary filters) and
  `reset`. `reset` clears both filters and bumps a counter (`resetKey`) that
  the filter fields use to clear what the user typed.
- **Everything else** (forms, pagination, modals, loading) stays in local
  component state.

### API layer

`src/lib/api/api.js` exports a single `request()` function that:

- sends JSON by default and leaves `FormData` untouched (image uploads);
- adds the `Authorization: Bearer ...` header when a token exists;
- on a `401` or `403`, tries once to renew the session with the refresh token and
  repeats the request; if that fails, it clears the tokens and reloads the page;
- throws an `Error` with the API message when the response is not successful.

Endpoints are declared in `src/lib/api/endpoints.js`. Each module keeps its HTTP
calls in `*.service.js` files, separate from the UI:

| File                                                  | Responsibility                                                         |
| ----------------------------------------------------- | ---------------------------------------------------------------------- |
| `modules/auth/auth.service.js`                        | Login, sign-up, image upload, profile and preferences, password reset. |
| `modules/home/home.service.js`                        | Most recent items.                                                     |
| `modules/buscar-objetos/buscarObjetos.service.js`     | Item search and categories.                                            |
| `modules/cadastrar-objetos/cadastraObjeto.service.js` | Image upload and item creation.                                        |
| `modules/detalhes-objeto/detalhesObjeto.service.js`   | One item by id.                                                        |
| `modules/private/private.service.js`                  | User data, own items, notifications, account deletion, logout.         |
| `modules/private/edit-objeto/editarObjeto.service.js` | Update and delete an item.                                             |

### Search and filtering

The search page calls `GET /items/search` once, with no parameters, so it
receives the API's default first page (the 20 most recent items). Filtering by
item name, location (city or address), category and date range, plus the
all / lost / found switch, runs in the browser (`utils/filters/filtrarObjetos.js`),
and results are paginated locally, 6 per page. When nothing matches, the empty
state offers a **Clear filters** button that resets the filter context and
clears every field without reloading the page.

### Posting an item

The form collects type, title, category, state, city, neighborhood, date and
time, description and photos. It accepts up to 6 photos of 5 MB each (image types
only). Photos are uploaded first (`POST /uploads/images`), and the returned URLs
are sent with the item data. The screen includes a confirmation step and
success and error messages.

### User area

- **Profile:** personal data, avatar, preferences (notifications, e-mail,
  showing your e-mail on items, light or dark theme), and a danger zone with
  logout and account deletion.
- **My items:** lists your items, 8 per page (3 on small screens). The API
  keeps deleted items in your history, so the app asks for them separately
  (`GET /items/me?status=INATIVO`) and shows them with a "Deleted" badge and a
  notice, without a details link or edit menu. This is needed because the `status`
  field returned for each item is its type (lost or found), not its workflow
  status.
- **Notifications:** list, mark one or all as read.
- **Edit item:** update fields and photos, or delete the item (soft delete).

If someone opens an item that no longer exists or can't be loaded, the details
page shows a friendly "item unavailable" screen.

### Internationalization

The interface is available in Portuguese and English. Translations live in
`src/i18n/locales/pt.json` and `en.json`, which must keep the same keys. The
initial language is the one saved in `localStorage` (key `language`), otherwise
Portuguese if the browser language starts with `pt`, otherwise English. The
`LanguageSwitcher` in the header changes it, and `<html lang>` is updated to match.

### Theming, styling and responsiveness

Styles sit next to their components, and shared values (colors, borders, shadows)
are CSS variables in `src/styles/variables.css`. The theme (`light` or `dark`)
is stored in `localStorage` (key `tema`), defaults to light and is applied through
the `data-theme` attribute on `<html>`. It is changed in the profile preferences.
Layouts adapt to small screens, and the header has a mobile menu.

### Category icons

Each item card shows an icon that matches its category. `utils/categories/categoriaIcone.js`
maps the category name to one of six SVG files in `assets/icons/categorias`,
ignoring accents and case, and falls back to the "Other" icon.

### Error and empty states

`src/pages/errors/` contains the loading screen, not authenticated, page not
found, no items found (with **Clear filters**), no items registered, and
item unavailable.

## Authentication and session storage

The API issues an access token and a refresh token. They are stored in
`localStorage` when the user chooses "remember me", otherwise in
`sessionStorage` for the current browser session.

> **Security note.** Tokens in web storage can be read by any script running on
> the same origin, so an XSS flaw would expose them. This trade-off is
> acceptable for an academic project, but a production system should weigh it
> (for example, with `httpOnly` cookies and a stricter Content Security Policy).

## Deployment

The app is static. To publish it:

1. Set `VITE_API_BASE_URL` to the production API URL (it is read at build time).
2. Run `npm ci` and `npm run build`.
3. Publish `dist/`.
4. Make the host send every route to `index.html` (SPA fallback). The included
   `vercel.json` does this for Vercel.
5. Add the published origin to the API's CORS settings (`CORS_ALLOWED_ORIGINS`).

## Quality and testing

`npm run lint` runs ESLint and `npm run build` validates the production bundle.
There are **no automated tests** for the front-end yet. The main flows should be
checked by hand: public navigation, sign-up, login, protected routes, search with
filters and clearing filters, item details, posting with and without photos,
editing and deleting an item, profile and password changes, notifications,
language and theme switching, small screens, and API failure states.

## Known limitations

- **Reset password screen missing.** The app lets users request the e-mail
  (`/auth/forgot-password`), but there is no page to choose a new password.
  The e-mail link points to `/reset-password?token=...`, which currently shows
  the "not found" page, although `ENDPOINTS.auth.resetpassword` is declared.
- **Terms of Use and Privacy Policy pages are missing.** The sign-up checkbox
  links to `/termos-de-uso` and `/politica-de-privacidade`, which show the
  "not found" page.
- **Search is client-side** and covers only the 20 most recent items (see
  [Search and filtering](#search-and-filtering)). "My items" also loads only the
  first page of results.
- **Item status and type cannot be changed** from the UI, although the API
  supports it.
- Access and refresh tokens live in web storage (see the security note).
- When a session cannot be renewed, the app clears the tokens and reloads the page.
- No automated tests, no CI workflow, and the code is JavaScript, not TypeScript.

## Quick reference

| What                | Where                                       |
| ------------------- | ------------------------------------------- |
| Entry point         | `src/main.jsx`                              |
| Layout and theme    | `src/App.jsx`                               |
| Routes              | `src/routes/Routes.jsx`, `PrivateRoute.jsx` |
| HTTP client         | `src/lib/api/api.js`                        |
| Endpoints           | `src/lib/api/endpoints.js`                  |
| Auth context        | `src/contexts/authContexts/`                |
| Filter context      | `src/contexts/filterContexts/`              |
| Translations        | `src/i18n/locales/`                         |
| Features            | `src/modules/`                              |
| Shared components   | `src/components/`                           |
| Global styles       | `src/styles/`                               |
| Environment example | `.env.example`                              |
