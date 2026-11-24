# Achados e Devolvidos: Front-end

[English](README.md) | **Português (Brasil)**

> **Projeto acadêmico, não é um serviço real.** Este é o front-end de um
> **Trabalho de Conclusão de Curso (TCC)** construído para fins de aprendizado
> e como peça de portfólio. Não é um serviço real de achados e perdidos e não
> tem vínculo com nenhuma empresa ou instituição. Use apenas dados fictícios.
> Veja o
> [README do projeto](../README.pt-BR.md#contexto-acadêmico-e-aviso-legal).

Aplicação de página única (React + Vite) do **Achados e Devolvidos**, uma
plataforma em que as pessoas cadastram, pesquisam e recuperam objetos perdidos
e encontrados. Este documento cobre apenas o front-end. A API está documentada
em [`../backend-refatorado/README.md`](../backend-refatorado/README.md).

## Funcionalidades e páginas

| Rota                           | Acesso   | Descrição                                                     |
| ------------------------------ | -------- | ------------------------------------------------------------- |
| `/`                            | Público  | Página inicial com os 4 itens mais recentes.                  |
| `/buscar-objetos`              | Público  | Busca e listagem de itens, com filtros e paginação.           |
| `/buscar-objetos/:id`          | Público  | Detalhes do item, galeria de imagens e formulário de contato. |
| `/como-funciona`               | Público  | Página "Como funciona".                                       |
| `/auth/login`                  | Público  | Login (com a opção "lembrar de mim").                         |
| `/auth/register`               | Público  | Cadastro em etapas.                                           |
| `/auth/forgot-password`        | Público  | Solicitação do e-mail de redefinição de senha.                |
| `/cadastrar-objetos`           | Restrito | Cadastro de um item perdido ou encontrado.                    |
| `/user-area`                   | Restrito | Perfil, "Meus objetos" e notificações.                        |
| `/user-area/editar-objeto/:id` | Restrito | Edição ou exclusão de um dos seus itens.                      |
| `/user-area/change-password`   | Restrito | Alteração da senha da conta.                                  |

As rotas restritas são envolvidas pelo `PrivateRoute`. Sem um token de acesso
armazenado, a aplicação mostra a tela "não autenticado" em vez da página.

## Tecnologias

| Tecnologia              | Uso                                                     |
| ----------------------- | ------------------------------------------------------- |
| React 19                | Interface baseada em componentes.                       |
| Vite 8                  | Servidor de desenvolvimento e build de produção.        |
| React Router 8          | Rotas e layouts aninhados.                              |
| i18next + react-i18next | Traduções em português e inglês.                        |
| React IMask             | Máscaras de campos nos formulários.                     |
| React DatePicker        | Seleção de datas e períodos.                            |
| Fetch API               | Cliente HTTP (encapsulado em `src/lib/api/api.js`).     |
| CSS puro                | Estilos ao lado de cada componente, mais variáveis CSS. |
| ESLint                  | Análise estática (com `eslint-plugin-react-hooks`).     |

As versões exatas estão em `package.json` e `package-lock.json`.

## Como executar

**Requisitos:** Node.js 22.22 ou superior (exigido pelo React Router 8), npm e
uma instância da API em execução.

```bash
cd front-end
npm install                 # ou "npm ci" para seguir exatamente o arquivo de lock
cp .env.example .env        # depois informe a URL da API
npm run dev                 # http://localhost:5173
```

A única variável de ambiente é a URL base da API:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Variáveis com prefixo `VITE_` são incluídas no código que vai para o navegador,
então nunca coloque segredos nelas.

| Comando           | Descrição                                      |
| ----------------- | ---------------------------------------------- |
| `npm run dev`     | Inicia o servidor de desenvolvimento do Vite.  |
| `npm run build`   | Gera o build de produção na pasta `dist/`.     |
| `npm run preview` | Executa uma prévia local do build de produção. |
| `npm run lint`    | Executa o ESLint.                              |

## Estrutura do projeto

```text
front-end/
├── public/                     Arquivos estáticos (favicon)
├── src/
│   ├── assets/                 Imagens e ícones (ícones de categoria em assets/icons/categorias)
│   ├── components/             Componentes compartilhados
│   │   ├── Header/             Cabeçalho e navegação principal
│   │   ├── LanguageSwitcher/   Alternador PT / EN
│   │   ├── filter/             Filtros principais, dropdown e período
│   │   ├── loading/
│   │   └── status/             Selo de status perdido / encontrado
│   ├── contexts/               Contextos do React
│   │   ├── authContexts/       Estado de autenticação
│   │   └── filterContexts/     Estado dos filtros da busca (useReducer)
│   ├── hooks/filters/          Hook para ler o contexto de filtros
│   ├── i18n/                   Configuração do i18next e locales/{pt,en}.json
│   ├── lib/api/                Cliente HTTP (api.js) e endpoints (endpoints.js)
│   ├── modules/                Funcionalidades, cada uma com páginas, componentes, rotas e serviços
│   │   ├── auth/               Login, cadastro e esqueci a senha
│   │   ├── buscar-objetos/     Busca
│   │   ├── cadastrar-objetos/  Cadastro de item
│   │   ├── como-funciona/      Como funciona
│   │   ├── detalhes-objeto/    Detalhes do item
│   │   ├── home/               Página inicial
│   │   └── private/            Área autenticada (usuário, editar item, trocar senha)
│   ├── pages/errors/           Telas de erro e estados vazios
│   ├── routes/                 Composição das rotas (Routes.jsx) e PrivateRoute.jsx
│   ├── styles/                 global.css e variables.css
│   └── utils/                  Funções auxiliares (categories, date, filters, images, inputs, location, validators)
├── index.html
├── vercel.json                 Redirecionamento de SPA para a Vercel
├── vite.config.js
└── eslint.config.js
```

## Como funciona

### Rotas e layout

O `src/main.jsx` monta o roteador. O `src/App.jsx` é o layout compartilhado:
fornece o contexto de autenticação, renderiza o cabeçalho e um `Outlet`, e
guarda o estado do tema. Cada módulo exporta seu próprio objeto de rotas, e o
`src/routes/Routes.jsx` as reúne. URLs desconhecidas caem na página "não
encontrada".

### Gerenciamento de estado

- **Autenticação.** O `AuthProvider` expõe `isAuthenticated`, inicializado
  verificando se há um token de acesso no `localStorage` ou no `sessionStorage`.
- **Filtros da busca.** O `FilterProvider` usa `useReducer` com três ações:
  `add` (filtro secundário: todos, perdidos, encontrados), `change` (filtros
  principais) e `reset`. O `reset` limpa os filtros e incrementa um contador
  (`resetKey`) que os campos usam para apagar o que a pessoa digitou.
- **O restante** (formulários, paginação, modais, carregamento) fica em estado
  local dos componentes.

### Camada de API

O `src/lib/api/api.js` exporta uma única função `request()` que:

- envia JSON por padrão e preserva `FormData` (upload de imagens);
- adiciona o cabeçalho `Authorization: Bearer ...` quando há token;
- em respostas `401` ou `403`, tenta uma vez renovar a sessão com o refresh
  token e repete a requisição; se falhar, apaga os tokens e recarrega a página;
- lança um `Error` com a mensagem da API quando a resposta não é bem-sucedida.

Os endpoints ficam em `src/lib/api/endpoints.js`. Cada módulo mantém suas
chamadas HTTP em arquivos `*.service.js`, separadas da interface:

| Arquivo                                               | Responsabilidade                                                                |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| `modules/auth/auth.service.js`                        | Login, cadastro, upload de imagem, perfil e preferências, recuperação de senha. |
| `modules/home/home.service.js`                        | Itens mais recentes.                                                            |
| `modules/buscar-objetos/buscarObjetos.service.js`     | Busca de itens e categorias.                                                    |
| `modules/cadastrar-objetos/cadastraObjeto.service.js` | Upload das imagens e criação do item.                                           |
| `modules/detalhes-objeto/detalhesObjeto.service.js`   | Um item pelo identificador.                                                     |
| `modules/private/private.service.js`                  | Dados do usuário, itens próprios, notificações, exclusão de conta, logout.      |
| `modules/private/edit-objeto/editarObjeto.service.js` | Atualização e exclusão de um item.                                              |

### Busca e filtros

A página de busca chama `GET /items/search` uma única vez, sem parâmetros, e por
isso recebe a primeira página padrão da API (os 20 itens mais recentes). O
filtro por nome do item, local (cidade ou endereço), categoria e período, além
do seletor todos / perdidos / encontrados, roda no navegador
(`utils/filters/filtrarObjetos.js`), e os resultados são paginados localmente,
6 por página. Quando nada corresponde, o estado vazio oferece o botão **Limpar
filtros**, que reinicia o contexto de filtros e limpa todos os campos sem
recarregar a página.

### Cadastro de item

O formulário coleta tipo, título, categoria, estado, cidade, bairro, data e
horário, descrição e fotos. Aceita até 6 fotos de 5 MB cada (somente tipos de
imagem). As fotos são enviadas primeiro (`POST /uploads/images`), e as URLs
retornadas seguem junto com os dados do item. A tela tem uma etapa de
confirmação e mensagens de sucesso e erro.

### Área do usuário

- **Perfil:** dados pessoais, avatar, preferências (notificações, e-mail,
  exibir seu e-mail nos itens, tema claro ou escuro) e uma zona de perigo com
  logout e exclusão de conta.
- **Meus objetos:** lista seus itens, 8 por página (3 em telas pequenas). A API
  mantém os itens excluídos no seu histórico, então o app os pede separadamente
  (`GET /items/me?status=INATIVO`) e os mostra com um selo "Excluído" e um
  aviso, sem link de detalhes nem menu de edição. Isso é necessário porque o
  campo `status` devolvido em cada item é o tipo (perdido ou encontrado), e não
  o status do fluxo.
- **Notificações:** lista, marcar uma ou todas como lidas.
- **Editar item:** atualizar campos e fotos, ou excluir o item (exclusão lógica).

Se alguém abrir um item que não existe mais ou que não pôde ser carregado, a
página de detalhes mostra uma tela amigável de "objeto indisponível".

### Internacionalização

A interface está disponível em português e inglês. As traduções ficam em
`src/i18n/locales/pt.json` e `en.json`, que devem manter as mesmas chaves. O
idioma inicial é o salvo no `localStorage` (chave `language`); se não houver,
português quando o idioma do navegador começa com `pt`, e inglês nos demais
casos. O `LanguageSwitcher` no cabeçalho troca o idioma, e o `<html lang>` é
atualizado junto.

### Tema, estilos e responsividade

Os estilos ficam ao lado dos componentes, e os valores compartilhados (cores,
bordas, sombras) são variáveis CSS em `src/styles/variables.css`. O tema
(`light` ou `dark`) é salvo no `localStorage` (chave `tema`), começa no claro e
é aplicado pelo atributo `data-theme` no `<html>`. Ele é alterado nas
preferências do perfil. Os layouts se adaptam a telas pequenas, e o cabeçalho
tem um menu para celular.

### Ícones de categoria

Cada card de item mostra um ícone da respectiva categoria.
`utils/categories/categoriaIcone.js` associa o nome da categoria a um de seis
arquivos SVG em `assets/icons/categorias`, ignorando acentos e maiúsculas, e
usa o ícone de "Outros" quando não reconhece o nome.

### Telas de erro e estados vazios

A pasta `src/pages/errors/` contém: carregamento, não autenticado, página não
encontrada, nenhum item encontrado (com **Limpar filtros**), nenhum item
cadastrado e objeto indisponível.

## Autenticação e armazenamento da sessão

A API emite um token de acesso e um token de renovação. Eles ficam no
`localStorage` quando a pessoa escolhe "lembrar de mim"; caso contrário, ficam
no `sessionStorage`, durante a sessão do navegador.

> **Observação de segurança.** Tokens em armazenamento web podem ser lidos por
> qualquer script executado na mesma origem, então uma falha de XSS os
> exporia. Essa escolha é aceitável em um projeto acadêmico, mas um sistema em
> produção deveria avaliá-la (por exemplo, com cookies `httpOnly` e uma
> Content Security Policy mais restrita).

## Publicação (deploy)

A aplicação é estática. Para publicá-la:

1. Defina `VITE_API_BASE_URL` com a URL da API de produção (ela é lida no
   momento do build).
2. Execute `npm ci` e `npm run build`.
3. Publique a pasta `dist/`.
4. Configure a hospedagem para enviar todas as rotas ao `index.html` (fallback
   de SPA). O `vercel.json` incluído faz isso na Vercel.
5. Adicione a origem publicada nas configurações de CORS da API
   (`CORS_ALLOWED_ORIGINS`).

## Qualidade e testes

`npm run lint` executa o ESLint e `npm run build` valida o bundle de produção.
Ainda **não há testes automatizados** no front-end. Os fluxos principais
precisam ser conferidos manualmente: navegação pública, cadastro, login, rotas
protegidas, busca com filtros e limpeza de filtros, detalhes do item, cadastro
com e sem fotos, edição e exclusão de um item, alteração de perfil e senha,
notificações, troca de idioma e tema, telas pequenas e falhas da API.

## Limitações conhecidas

- **Falta a tela de redefinição de senha.** O app permite solicitar o e-mail
  (`/auth/forgot-password`), mas não existe uma página para escolher a nova
  senha. O link do e-mail aponta para `/reset-password?token=...`, que hoje
  mostra a página "não encontrada", embora `ENDPOINTS.auth.resetpassword`
  esteja declarado.
- **Faltam as páginas de Termos de Uso e Política de Privacidade.** A caixa de
  seleção do cadastro aponta para `/termos-de-uso` e
  `/politica-de-privacidade`, que mostram a página "não encontrada".
- **A busca é feita no cliente** e cobre apenas os 20 itens mais recentes
  (veja [Busca e filtros](#busca-e-filtros)). "Meus objetos" também carrega
  apenas a primeira página de resultados.
- **O status e o tipo do item não podem ser alterados** pela interface, embora
  a API permita.
- Os tokens de acesso e de renovação ficam em armazenamento web (veja a
  observação de segurança).
- Quando a sessão não pode ser renovada, o app apaga os tokens e recarrega a
  página.
- Sem testes automatizados, sem workflow de CI, e o código é JavaScript, não
  TypeScript.

## Referência rápida

| O quê               | Onde                                        |
| ------------------- | ------------------------------------------- |
| Ponto de entrada    | `src/main.jsx`                              |
| Layout e tema       | `src/App.jsx`                               |
| Rotas               | `src/routes/Routes.jsx`, `PrivateRoute.jsx` |
| Cliente HTTP        | `src/lib/api/api.js`                        |
| Endpoints           | `src/lib/api/endpoints.js`                  |
| Contexto de auth    | `src/contexts/authContexts/`                |
| Contexto de filtros | `src/contexts/filterContexts/`              |
| Traduções           | `src/i18n/locales/`                         |
| Funcionalidades     | `src/modules/`                              |
| Componentes         | `src/components/`                           |
| Estilos globais     | `src/styles/`                               |
| Exemplo de ambiente | `.env.example`                              |
