# Documentação do Front-end — Achados e Devolvidos

## 1. Apresentação

O **Achados e Devolvidos** é uma aplicação web que tem como propósito facilitar o reencontro entre pessoas que perderam objetos e pessoas que encontraram esses itens. A plataforma disponibiliza recursos para divulgar objetos encontrados, pesquisar itens cadastrados, consultar informações e gerenciar os anúncios vinculados à conta do usuário.

Este documento descreve exclusivamente o **Front-end** da aplicação: sua estrutura, tecnologias, instalação, páginas, funcionalidades, gerenciamento de estado, integração com a API e procedimentos de execução. A implementação do servidor, banco de dados e regras internas do Back-end não faz parte deste escopo.

## 2. Escopo do Front-end

A aplicação oferece interfaces para:

- visualizar a página inicial e os objetos cadastrados recentemente;
- pesquisar objetos disponíveis na plataforma;
- consultar os detalhes de um objeto;
- cadastrar uma conta e realizar login;
- solicitar recuperação de senha;
- cadastrar objetos encontrados;
- acessar uma área autenticada do usuário;
- consultar e editar informações do perfil;
- visualizar os próprios objetos cadastrados;
- editar ou excluir objetos;
- consultar notificações e marcar notificações como lidas;
- alterar a senha da conta;
- consultar uma página explicativa sobre o funcionamento da plataforma.

A disponibilidade efetiva de cada operação depende da comunicação com a API e das permissões da conta.

## 3. Tecnologias e ferramentas

| Tecnologia/ferramenta | Utilização |
|---|---|
| React 19 | Construção da interface por componentes. |
| JavaScript (ES Modules) | Linguagem utilizada na aplicação. |
| Vite 8 | Servidor de desenvolvimento e ferramenta de build. |
| React Router 8 | Definição e navegação entre rotas. |
| React DOM | Renderização da aplicação no navegador. |
| React IMask | Recursos de máscara para campos de formulário. |
| React DatePicker | Componente de seleção de datas, quando utilizado nas telas. |
| CSS | Estilização dos componentes, páginas e layouts. |
| ESLint | Análise estática e padronização do código. |
| Fetch API | Comunicação HTTP com o Back-end. |

As versões exatas das dependências estão declaradas em `package.json` e `package-lock.json`.

## 4. Arquitetura e organização

O Front-end utiliza uma organização modular por funcionalidades. Cada módulo concentra as páginas, componentes, estilos, rotas e, quando necessário, serviços responsáveis pelas operações daquela funcionalidade.

A estrutura principal é:

```text
front-end/
├── public/                         # Arquivos públicos servidos pelo Vite
├── src/
│   ├── assets/                     # Imagens, logotipos e ícones
│   ├── components/                 # Componentes compartilhados
│   │   ├── Header/                  # Cabeçalho e navegação principal
│   │   └── status/                  # Exibição de status
│   ├── config/                     # Configurações da aplicação
│   ├── contexts/                   # Contextos globais do React
│   │   ├── authContexts/           # Estado de autenticação
│   │   └── filterContexts/         # Estado dos filtros
│   ├── hooks/                      # Hooks personalizados
│   ├── lib/
│   │   └── api/                    # Cliente HTTP e definição dos endpoints
│   ├── modules/                    # Funcionalidades organizadas por módulo
│   │   ├── auth/                   # Login, cadastro e recuperação de senha
│   │   ├── buscar-objetos/          # Pesquisa e listagem de objetos
│   │   ├── cadastrar-objetos/       # Cadastro de objetos
│   │   ├── como-funciona/           # Explicação do funcionamento
│   │   ├── detalhes-objeto/         # Detalhes de um objeto
│   │   ├── home/                   # Página inicial
│   │   └── private/                # Funcionalidades autenticadas
│   ├── pages/
│   │   └── errors/                 # Telas de erro e estados sem conteúdo
│   ├── routes/                     # Composição e proteção de rotas
│   ├── styles/                     # Estilos e variáveis globais
│   ├── utils/                      # Funções utilitárias
│   ├── App.jsx                     # Estrutura principal da aplicação
│   └── main.jsx                    # Ponto de entrada do React
├── .env.example                    # Exemplo de variável de ambiente
├── eslint.config.js                # Configuração do ESLint
├── index.html                      # Documento HTML principal
├── package.json                    # Dependências e scripts
├── package-lock.json               # Versões bloqueadas das dependências
└── vite.config.js                  # Configuração do Vite
```

### 4.1. Ponto de entrada

O arquivo `src/main.jsx` inicializa a aplicação React, importa os estilos globais e disponibiliza o roteador por meio de `RouterProvider`.

### 4.2. Estrutura principal da aplicação

O componente `src/App.jsx` funciona como estrutura compartilhada das páginas. Ele disponibiliza o contexto de autenticação, apresenta o cabeçalho e renderiza o conteúdo correspondente à rota atual por meio de `Outlet`.

O mesmo componente controla a preferência de tema visual (`light` ou `dark`). A preferência é lida e armazenada no `localStorage`, e o tema selecionado é aplicado ao elemento raiz do documento por meio do atributo `data-theme`.

### 4.3. Organização modular

Os módulos ficam em `src/modules/`. Em geral, cada módulo possui um arquivo de rotas, páginas e componentes específicos. Os arquivos `*.service.js` concentram chamadas relacionadas à API, mantendo as operações de comunicação separadas da apresentação da interface.

## 5. Páginas, rotas e funcionalidades

As rotas são reunidas em `src/routes/Routes.jsx` e utilizam o React Router. A tabela apresenta os caminhos declarados no código-fonte.

| Rota | Acesso | Descrição |
|---|---|---|
| `/` | Público | Página inicial, apresentação da plataforma e objetos recentes. |
| `/buscar-objetos` | Público | Pesquisa e listagem de objetos cadastrados. |
| `/buscar-objetos/:id` | Público | Visualização dos detalhes de um objeto específico. |
| `/como-funciona` | Público | Orientações sobre como utilizar a plataforma. |
| `/auth/login` | Público | Formulário de autenticação. |
| `/auth/register` | Público | Fluxo de criação de conta. |
| `/auth/forgot-password` | Público | Solicitação de recuperação de senha. |
| `/cadastrar-objetos` | Restrito | Formulário de cadastro de um objeto. |
| `/user-area` | Restrito | Área do usuário, com perfil, objetos e notificações. |
| `/user-area/change-password` | Restrito | Alteração da senha da conta. |
| `/user-area/editar-objeto/:id` | Restrito | Edição de um objeto cadastrado pelo usuário. |
| `/buscar-objetos/user/:id` | Restrito | Edição dos detalhes de um objeto na área autenticada. |

Rotas restritas são envolvidas pelo componente `PrivateRoute`. Quando não há autenticação identificada, a aplicação apresenta a tela `NotAuthenticated` em vez de renderizar o conteúdo protegido.

### 5.1. Página inicial

**Arquivos principais:** `src/modules/home/`

A página inicial apresenta a proposta do sistema, direciona o usuário às principais ações e exibe objetos cadastrados recentemente. Os dados dos objetos recentes são solicitados pelo serviço `home.service.js`, que consulta a pesquisa de objetos com paginação e ordenação por data de criação.

### 5.2. Busca de objetos

**Arquivos principais:** `src/modules/buscar-objetos/`

A tela de busca permite consultar os objetos disponíveis. A implementação contempla listagem em cards, filtros, paginação e estados de carregamento e erro. Os dados são obtidos por meio de `buscarObjetos.service.js`.

O módulo também possui componentes específicos para os cards principais e filtros secundários. Os arquivos JSON existentes no módulo fornecem dados utilizados na apresentação/configuração desses elementos.

### 5.3. Detalhes do objeto

**Arquivos principais:** `src/modules/detalhes-objeto/`

A página utiliza o identificador presente na URL para solicitar os dados do objeto. A interface apresenta as informações e imagens cadastradas. Também possui um formulário de contato com campos para nome, e-mail e mensagem/informações, além de validação no próprio Front-end.

### 5.4. Cadastro de objetos

**Arquivos principais:** `src/modules/cadastrar-objetos/`

O formulário permite informar dados do objeto, incluindo:

- tipo da ocorrência (conforme opções disponíveis na interface);
- nome ou título do objeto;
- categoria;
- estado, cidade e bairro;
- data e horário;
- descrição;
- características adicionais;
- fotografias.

O código limita a seleção a seis fotografias, com tamanho máximo de 5 MB por arquivo e validação dos tipos de imagem aceitos. As imagens são enviadas ao serviço de upload antes do envio dos dados do objeto à API. A tela também apresenta etapas de confirmação e mensagens de sucesso ou erro.

### 5.5. Como funciona

**Arquivos principais:** `src/modules/como-funciona/`

Página informativa que apresenta as etapas de utilização da plataforma. Os elementos visuais e cards explicativos são organizados em componentes próprios do módulo.

### 5.6. Autenticação e cadastro de conta

**Arquivos principais:** `src/modules/auth/`

O módulo de autenticação reúne três fluxos:

- **Login:** recebe e-mail e senha, permite a opção de lembrar o usuário e apresenta mensagens de erro quando a autenticação não é concluída.
- **Cadastro:** conduz o usuário por etapas de preenchimento de dados e personalização/preferências, finalizando a criação da conta.
- **Recuperação de senha:** recebe o e-mail informado pelo usuário e solicita o procedimento de recuperação à API.

Os componentes de cada etapa do cadastro estão organizados em subpastas dentro de `pages/register/components/`.

### 5.7. Área do usuário

**Arquivos principais:** `src/modules/private/user/`

A área autenticada reúne diferentes seções acessadas por meio de uma navegação lateral:

- **Perfil:** consulta e atualização de informações pessoais, fotografia e preferências disponíveis na interface.
- **Meus objetos:** lista os objetos vinculados ao usuário, com paginação e opções de gerenciamento.
- **Notificações:** apresenta notificações recebidas e permite marcar uma notificação individual ou todas como lidas.

A página principal da área do usuário carrega as informações da conta e organiza a exibição das seções internas.

### 5.8. Edição e exclusão de objetos

**Arquivos principais:** `src/modules/private/edit-objeto/` e `src/modules/private/edit-detalhes-objeto/`

A edição permite atualizar informações do objeto, como título, categoria, localização, data, horário, descrição, características e fotografias. O formulário diferencia imagens já cadastradas de novas imagens selecionadas. Também existem ações de confirmação para salvar alterações e excluir o objeto.

### 5.9. Alteração de senha

**Arquivos principais:** `src/modules/private/change-password/`

Disponibiliza um formulário para informar a senha atual e a nova senha. A solicitação é encaminhada ao serviço responsável pela alteração de senha na API.

### 5.10. Páginas de estado e erro

**Diretório:** `src/pages/errors/`

O projeto possui telas específicas para situações como carregamento, usuário não autenticado, rota não encontrada e ausência de objetos ou de objetos cadastrados. Essas páginas ajudam a apresentar estados alternativos da interface sem deixar o usuário sem orientação.

## 6. Navegação e cabeçalho

O componente compartilhado `src/components/Header/` contém a identidade visual e a navegação principal. Ele disponibiliza atalhos para início, busca de objetos, cadastro e explicação de funcionamento, além de acesso à autenticação ou ao perfil, conforme o estado de login.

O cabeçalho também possui menu adaptado para telas menores, controlado por estado interno do componente. A estrutura visual é definida em `Header.css`.

## 7. Gerenciamento de estado e contextos

O projeto utiliza os recursos de estado do React, principalmente `useState`, `useEffect`, `useContext` e `useReducer`.

### 7.1. Contexto de autenticação

**Arquivo:** `src/contexts/authContexts/AuthContext.jsx`

O `AuthProvider` disponibiliza o estado `isAuthenticated` e a função `setIsAuthenticated` para os componentes descendentes. Na inicialização, a aplicação verifica a existência de um token de acesso no `localStorage` ou no `sessionStorage`.

### 7.2. Contexto de filtros

**Arquivo:** `src/contexts/filterContexts/filterContext.jsx`

O `FilterProvider` utiliza `useReducer` para centralizar os filtros da busca. O estado contempla filtros principais e secundários, atualizados por ações despachadas aos consumidores do contexto.

### 7.3. Estado local

Estados específicos de formulários, carregamento, mensagens, paginação, modais, imagens e menus são mantidos nos próprios componentes quando não precisam ser compartilhados globalmente.

## 8. Integração com a API

A comunicação com o Back-end é centralizada em `src/lib/api/`.

### 8.1. Configuração da URL da API

A variável de ambiente utilizada é:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

O valor acima é apenas um exemplo de configuração local. Deve ser substituído pela URL real da API utilizada no ambiente de execução. O arquivo `.env.example` do projeto apresenta o nome da variável esperada.

O arquivo `src/lib/api/endpoints.js` utiliza essa variável para montar os endereços dos recursos de autenticação, usuários, objetos, notificações, categorias e upload de imagens.

### 8.2. Cliente HTTP

**Arquivo:** `src/lib/api/api.js`

A função `request` centraliza as requisições realizadas com a Fetch API. Entre suas responsabilidades estão:

- definir o cabeçalho `Content-Type` para requisições JSON;
- preservar o envio de `FormData` sem forçar o cabeçalho JSON;
- incluir o token de acesso no cabeçalho `Authorization`, quando disponível;
- interpretar a resposta da API;
- lançar erros quando a resposta HTTP não for bem-sucedida;
- tentar renovar a autenticação em respostas `401` ou `403`, quando aplicável.

### 8.3. Serviços por funcionalidade

Os arquivos de serviço separam as operações HTTP da lógica de apresentação. Entre os principais estão:

| Arquivo | Responsabilidade |
|---|---|
| `modules/auth/auth.service.js` | Login, cadastro, upload de imagem, atualização de perfil, preferências e recuperação de senha. |
| `modules/home/home.service.js` | Consulta dos objetos recentes. |
| `modules/buscar-objetos/buscarObjetos.service.js` | Busca de objetos e consulta de categorias. |
| `modules/cadastrar-objetos/cadastraObjeto.service.js` | Upload das imagens e cadastro de objetos. |
| `modules/detalhes-objeto/detalhesObjeto.service.js` | Consulta de um objeto pelo identificador. |
| `modules/private/private.service.js` | Dados do usuário, objetos próprios, notificações, exclusão de conta, alteração de senha e logout. |
| `modules/private/edit-objeto/editarObjeto.service.js` | Atualização e exclusão de objetos. |

A documentação dos contratos e do funcionamento interno dos endpoints deve ser consultada nos materiais do Back-end. Este documento descreve apenas como o Front-end consome esses recursos.

## 9. Autenticação e armazenamento de sessão

O Front-end utiliza tokens de acesso e de renovação fornecidos pela API. Os tokens são armazenados no `localStorage` quando a opção de permanência é utilizada ou no `sessionStorage` para a sessão temporária, conforme o fluxo implementado.

O cliente HTTP recupera o token disponível e o envia como Bearer Token. Quando necessário, tenta renovar a sessão por meio do endpoint de refresh. Caso a renovação falhe, os tokens são removidos e a página é recarregada.

As rotas que exigem autenticação são protegidas pelo componente `PrivateRoute.jsx`.

> **Observação de segurança:** o armazenamento de tokens em `localStorage` e `sessionStorage` deve ser considerado na avaliação de segurança da aplicação, pois esses dados podem ser acessados por scripts executados na mesma origem. A proteção contra XSS e as demais medidas de segurança também dependem das configurações e práticas do projeto como um todo.

## 10. Estilização, identidade visual e responsividade

Os estilos estão organizados em arquivos CSS próximos aos componentes e páginas correspondentes. Os estilos compartilhados ficam em `src/styles/`.

- `global.css`: regras globais de apresentação e estilos base.
- `variables.css`: variáveis CSS de cores, sombras, bordas, tipografia e valores compartilhados.

O projeto utiliza a fonte Poppins como fonte principal e variáveis CSS para manter consistência visual. Há suporte a temas claro e escuro por meio do atributo `data-theme` no elemento raiz. A adaptação a diferentes tamanhos de tela é implementada nos estilos dos componentes e páginas.

## 11. Funções utilitárias

O diretório `src/utils/` reúne funções e dados auxiliares reutilizados pela aplicação:

| Caminho | Finalidade |
|---|---|
| `date/date.js` | Funções relacionadas à formatação e manipulação de datas. |
| `filters/filtrarObjetos.js` | Apoio à filtragem de objetos. |
| `images/urlImagem.js` | Tratamento de URLs de imagens. |
| `inputs/inputs.js` | Funções auxiliares para campos de entrada. |
| `json/cidade-estados.json` | Dados de estados e cidades utilizados pela interface. |
| `location/localizacao.js` | Funções relacionadas à localização. |
| `validators.js` | Funções de validação utilizadas nos formulários. |

## 12. Requisitos para execução

Para executar o Front-end localmente, são necessários:

- Node.js compatível com a versão do Vite utilizada pelo projeto;
- npm;
- acesso ao repositório do projeto;
- uma instância da API disponível e acessível pela URL configurada no ambiente.

## 13. Instalação e execução local

### 13.1. Acessar a pasta do Front-end

Na raiz do repositório:

```bash
cd front-end
```

### 13.2. Instalar as dependências

```bash
npm install
```

Para reproduzir as versões registradas no arquivo de lock, também é possível utilizar:

```bash
npm ci
```

### 13.3. Configurar as variáveis de ambiente

Crie um arquivo `.env` na pasta `front-end`, utilizando `.env.example` como referência:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Ajuste a URL conforme o endereço em que a API estiver sendo executada. Variáveis com prefixo `VITE_` são disponibilizadas ao código do cliente; portanto, não devem conter senhas, chaves privadas ou outros segredos.

### 13.4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O Vite exibirá no terminal o endereço local para acessar a aplicação pelo navegador.

## 14. Scripts disponíveis

Os comandos abaixo estão definidos em `package.json`:

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o servidor de desenvolvimento do Vite. |
| `npm run build` | Gera a versão de produção na pasta `dist/`. |
| `npm run preview` | Executa uma prévia local do build de produção. |
| `npm run lint` | Executa a análise estática do ESLint. |

### 14.1. Gerar build de produção

```bash
npm run build
```

Os arquivos otimizados são gerados no diretório `dist/`. Essa pasta é o conteúdo estático que deve ser publicado em um serviço de hospedagem compatível.

### 14.2. Conferir o build localmente

Após gerar o build:

```bash
npm run preview
```

O comando inicia um servidor local para visualizar a versão de produção.

## 15. Publicação e deploy

O Front-end é uma aplicação web construída com Vite. Para publicação em um serviço de hospedagem estática:

1. configurar a variável `VITE_API_BASE_URL` com o endereço da API do ambiente de produção;
2. instalar as dependências;
3. executar `npm run build`;
4. publicar o conteúdo gerado em `dist/`;
5. configurar o serviço de hospedagem para direcionar rotas da aplicação ao `index.html` (fallback de SPA), permitindo o acesso direto a URLs internas;
6. verificar se o domínio publicado consegue acessar a API e se as configurações de CORS do Back-end permitem essa origem.

O repositório contém configuração do Vite, mas este documento não presume que exista um deploy ativo. O endereço de produção deve ser informado pela equipe quando estiver disponível.

## 16. Qualidade e validação

O projeto disponibiliza o ESLint por meio do comando `npm run lint`. O build pode ser validado com `npm run build`.

Não foi identificado um script específico de testes automatizados de interface no `package.json`. Por isso, recomenda-se que a equipe realize testes funcionais manuais dos principais fluxos, incluindo:

- navegação entre as páginas públicas;
- cadastro, login e recuperação de senha;
- acesso e bloqueio de rotas privadas;
- pesquisa, filtros e paginação de objetos;
- visualização dos detalhes de um objeto;
- cadastro de objeto com e sem fotografias;
- edição e exclusão de objeto;
- atualização de perfil e alteração de senha;
- consulta e leitura de notificações;
- comportamento em diferentes larguras de tela;
- estados de carregamento, ausência de dados e falha de comunicação com a API.

## 17. Histórico e colaboração

O repositório utiliza Git para controle de versão. A documentação geral do repositório descreve o fluxo de branches e Pull Requests adotado pela equipe. Para manter a rastreabilidade do Front-end, recomenda-se:

- criar branches específicas para cada funcionalidade ou correção;
- utilizar mensagens de commit objetivas e relacionadas à alteração realizada;
- abrir Pull Requests com descrição das mudanças;
- registrar decisões relevantes e alterações de configuração;
- manter esta documentação atualizada quando novas telas, rotas ou funcionalidades forem adicionadas.

## 18. Limites desta documentação

Este material cobre a aplicação localizada em `front-end/`. Não descreve a implementação Java/Spring Boot, persistência de dados, estrutura do banco, regras internas da API, configuração de infraestrutura do servidor ou documentação Swagger. Esses assuntos pertencem à documentação do Back-end.

Também não são declarados como concluídos recursos que dependem de serviços externos ou de uma API em execução. A disponibilidade de funcionalidades integradas deve ser validada no ambiente utilizado para a apresentação e avaliação do projeto.

## 19. Referência rápida

| Informação | Localização |
|---|---|
| Entrada da aplicação | `src/main.jsx` |
| Estrutura principal | `src/App.jsx` |
| Definição das rotas | `src/routes/Routes.jsx` |
| Proteção de rotas | `src/routes/PrivateRoute.jsx` |
| Cliente HTTP | `src/lib/api/api.js` |
| Endpoints | `src/lib/api/endpoints.js` |
| Contexto de autenticação | `src/contexts/authContexts/AuthContext.jsx` |
| Contexto de filtros | `src/contexts/filterContexts/filterContext.jsx` |
| Componentes compartilhados | `src/components/` |
| Funcionalidades | `src/modules/` |
| Estilos globais | `src/styles/` |
| Funções auxiliares | `src/utils/` |
| Dependências e comandos | `package.json` |
| Variáveis de ambiente | `.env.example` |

---

**Projeto:** Achados e Devolvidos  
**Escopo:** Documentação técnica do Front-end  
**Tecnologia principal:** React + Vite
