# Achados e Devolvidos

Projeto de TCC (+PraTI) — uma plataforma para ajudar a comunidade a reencontrar
objetos perdidos.

## Estrutura do repositório

```
.
├── backend-refatorado/   # API (Java/Spring Boot)
└── front-end/             # Aplicação web (React)
```

Cada diretório tem sua própria documentação, mais específica:

- **`backend-refatorado/README.md`** — visão geral do backend, como rodar o
  projeto localmente do zero.
- **`backend-refatorado/README-BACKEND-SETUP.md`** — stack, versões,
  dependências e ferramentas necessárias na máquina de quem for desenvolver
  no backend.
- **`backend-refatorado/README-BACKEND-ENDPOINTS.md`** — catálogo de
  endpoints implementados e o que ainda falta fazer.
- **`backend-refatorado/README-FRONTEND.md`** — guia de integração para
  quem consome a API (contratos de request/response, regras de segurança).
- **`backend-refatorado/ARQUITETURA.md`** — decisões técnicas do backend e
  o porquê de cada uma.

## Equipe

O grupo está dividido em dois times, cada um responsável por uma parte do
sistema:

- **Time de Backend** — API, banco de dados, autenticação, motor de match,
  chat em tempo real (possível alteração).
- **Time de Frontend** — interface web, integração com a API, experiência
  do usuário.

## Fluxo de contribuição e regras de Pull Request

As branches `main` e `backend-develop` são **protegidas**: ninguém consegue
dar `git push` direto nelas. Toda mudança precisa passar por um Pull
Request, com pelo menos **1 aprovação** antes do merge.

### Nomeação de branch

Toda tarefa começa em uma branch própria, criada a partir da branch de
integração correspondente (ver fluxo abaixo), com um nome claro e condizente
com o que está sendo feito:

- `feature/<o-que-foi-feito>` — para o time de backend (ex.:
  `feature/user-preferences-and-delete-account`).
- `feat/<o-que-foi-feito>` — para o time de frontend (ex.: `feat/home`).
- `fix/<o-que-foi-corrigido>` — para correções pontuais, em qualquer time.

Nada de misturar duas tarefas diferentes na mesma branch, nem commitar
direto em `main` ou `backend-develop`.

### Fluxo por time

**Backend:**

```
feature/<tarefa>  →  PR + aprovação  →  backend-develop  →  PR + aprovação  →  main
```

`backend-develop` funciona como a branch de integração do backend — reúne
várias features antes de irem para `main` de uma vez.

**Frontend:**

```
feat/<tarefa>  →  PR + aprovação  →  main
```

### Antes de abrir a PR

- Confirme que o projeto compila e, no caso do backend, que a suíte de
  testes passa localmente (`mvn verify` — ver `README-BACKEND-SETUP.md`).
- Descreva na PR **o que** foi feito de forma clara e objetiva.
- PRs pequenas e focadas em uma única tarefa são mais fáceis de revisar do
  que uma PR gigante misturando várias mudanças não relacionadas.
