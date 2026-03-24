# 🗓️ Vendify — Sprint de 5 Dias

> **Stack:** Fastify (Node.js) · PostgreSQL · Vue 3 + Vite · Tailwind CSS  
> **Entregáveis:** Código-fonte · Testes · Docker Compose · Diagramas · Documentação

---

## Visão Geral da Sprint

| Dia | Foco Principal | Status Esperado ao Final |
|-----|---------------|--------------------------|
| 1 | Infraestrutura, banco de dados e scaffolding | Projeto rodando localmente com DB criado |
| 2 | API Fastify — rotas, lógica e transações | Todos os endpoints funcionais e testados |
| 3 | Frontend Vue 3 — Produtos e Clientes | CRUD completo das duas entidades no navegador |
| 4 | Frontend Vue 3 — Pedidos e Itens (transação) | Fluxo completo de criação de pedido + itens |
| 5 | Testes, Docker, diagramas e documentação | Projeto pronto para entrega |

---

## 📅 Dia 1 — Infraestrutura, Banco de Dados e Scaffolding

O objetivo deste dia é garantir que toda a "armação" do projeto esteja no lugar antes de escrever qualquer lógica de negócio. Sair do dia 1 com o banco criado, migrations rodando e os dois projetos (API e frontend) inicializando sem erros é o sinal de que você está no caminho certo.

### 1.1 — Repositório e estrutura de pastas

- [ ] Criar o repositório no GitHub com o nome `vendify`
- [ ] Criar a estrutura de monorepo simples:
  ```
  vendify/
  ├── api/          ← projeto Fastify
  ├── web/          ← projeto Vue 3 + Vite
  ├── docs/         ← diagramas e documentação
  └── docker-compose.yml
  ```
- [ ] Criar `.gitignore` cobrindo `node_modules`, `.env`, `dist`, logs
- [ ] Criar o `README.md` raiz com título e seções a preencher ao longo da sprint

### 1.2 — Banco de dados PostgreSQL

- [ ] Criar o arquivo `docker-compose.yml` com o serviço do PostgreSQL (porta 5432, variáveis de ambiente no `.env`)
- [ ] Subir o banco localmente com `docker compose up -d postgres`
- [ ] Escolher e instalar a biblioteca de migrations na API: **`node-pg-migrate`** ou **`@fastify/postgres` + SQL puro em arquivos numerados**
- [ ] Criar as migrations na ordem correta (respeitando dependências de FK):
  - [ ] `001_create_produtos.sql` — `id_produto SERIAL PK, nome VARCHAR, preco NUMERIC(10,2)`
  - [ ] `002_create_clientes.sql` — `id_cliente SERIAL PK, nome VARCHAR, email VARCHAR UNIQUE`
  - [ ] `003_create_pedidos.sql` — `id_pedido SERIAL PK, data TIMESTAMPTZ DEFAULT NOW(), id_cliente FK`
  - [ ] `004_create_pedido_itens.sql` — `id_pedido_item SERIAL PK, id_pedido FK, id_produto FK, qtde INT, preco NUMERIC(10,2)`
- [ ] Rodar as migrations e validar as tabelas no `psql` ou DBeaver
- [ ] Criar seeds básicos: 5 produtos, 3 clientes — facilitará os testes manuais ao longo da sprint

### 1.3 — Scaffolding da API (Fastify)

- [ ] `cd api && npm init -y`
- [ ] Instalar dependências principais:
  - `fastify`, `@fastify/cors`, `@fastify/postgres`, `dotenv`
- [ ] Instalar dependências de dev:
  - `nodemon`, `vitest` (ou `tap`), `supertest`
- [ ] Criar `src/server.js` — instância do Fastify, registro dos plugins (CORS, postgres), listen na porta 3000
- [ ] Criar `src/routes/` com arquivos vazios: `produtos.js`, `clientes.js`, `pedidos.js`
- [ ] Registrar as rotas no server principal com prefixo: `/api/produtos`, `/api/clientes`, `/api/pedidos`
- [ ] Validar: `GET /` retornando `{ status: 'ok' }`

### 1.4 — Scaffolding do Frontend (Vue 3 + Vite + Tailwind)

- [ ] `cd web && npm create vite@latest . -- --template vue`
- [ ] Instalar Tailwind CSS (`tailwindcss`, `postcss`, `autoprefixer`) e rodar `npx tailwindcss init -p`
- [ ] Configurar `tailwind.config.js` para varrer `./src/**/*.{vue,js}`
- [ ] Instalar `vue-router@4`, `pinia`, `axios`
- [ ] Criar estrutura de pastas:
  ```
  src/
  ├── api/          ← funções axios por recurso
  ├── components/   ← componentes reutilizáveis (Modal, DataTable, etc.)
  ├── pages/        ← Produtos.vue, Clientes.vue, Pedidos.vue
  ├── router/
  └── stores/       ← Pinia stores
  ```
- [ ] Configurar o `vue-router` com as três rotas principais
- [ ] Validar: `npm run dev` abrindo a home sem erros no console

---

## 📅 Dia 2 — API Fastify: Rotas, Lógica e Transação Atômica

Este é o dia mais crítico da sprint do ponto de vista de back-end. A atenção principal está na **transação atômica de Pedidos + Itens**: se qualquer insert falhar (energia acabou, erro de validação, produto inexistente), o banco deve reverter tudo — o "pai sem o filho" nunca pode existir.

### 2.1 — CRUD de Produtos

- [ ] `GET /api/produtos` — lista todos
- [ ] `GET /api/produtos/:id` — busca por id
- [ ] `POST /api/produtos` — cria novo (body: `nome`, `preco`)
- [ ] `PUT /api/produtos/:id` — atualiza
- [ ] `DELETE /api/produtos/:id` — remove (verificar se não há itens vinculados; retornar 409 se houver)
- [ ] Validação de schema com `fastify.addSchema` / JSON Schema para `nome` e `preco`

### 2.2 — CRUD de Clientes

- [ ] `GET /api/clientes` — lista todos
- [ ] `GET /api/clientes/:id` — busca por id
- [ ] `POST /api/clientes` — cria novo (body: `nome`, `email`)
- [ ] `PUT /api/clientes/:id` — atualiza
- [ ] `DELETE /api/clientes/:id` — remove (verificar pedidos vinculados; retornar 409)
- [ ] Validação: `email` deve ser único — tratar o erro de unique constraint do Postgres (`error.code === '23505'`) retornando 422

### 2.3 — CRUD de Pedidos com Transação Atômica ⚠️

Este é o ponto de maior atenção. A criação de um pedido **nunca** deve persistir sem ao menos um item. Use `BEGIN / COMMIT / ROLLBACK` explícito via `pg` client, pois o pool do `@fastify/postgres` não gerencia transações automaticamente.

**Padrão a seguir no `POST /api/pedidos`:**
```js
// Pegar uma conexão dedicada do pool para isolar a transação
const client = await fastify.pg.connect();
try {
  await client.query('BEGIN');

  // 1. Insert no pedido
  const { rows: [pedido] } = await client.query(
    'INSERT INTO pedidos (id_cliente) VALUES ($1) RETURNING *',
    [body.id_cliente]
  );

  // 2. Insert em todos os itens usando o id retornado acima
  for (const item of body.itens) {
    await client.query(
      'INSERT INTO pedido_itens (id_pedido, id_produto, qtde, preco) VALUES ($1, $2, $3, $4)',
      [pedido.id_pedido, item.id_produto, item.qtde, item.preco]
    );
  }

  await client.query('COMMIT');
  reply.code(201).send(pedido);
} catch (err) {
  await client.query('ROLLBACK'); // <- garante que nada fica pela metade
  throw err;
} finally {
  client.release(); // <- SEMPRE devolver a conexão ao pool
}
```

- [ ] `POST /api/pedidos` — body: `{ id_cliente, itens: [{ id_produto, qtde, preco }] }` — **transação atômica**
- [ ] `GET /api/pedidos` — lista todos com join em `clientes` (retornar nome do cliente junto)
- [ ] `GET /api/pedidos/:id` — retorna pedido + array de itens com join em `produtos`
- [ ] `PUT /api/pedidos/:id` — atualiza dados do cabeçalho (apenas `id_cliente` e `data`)
- [ ] `DELETE /api/pedidos/:id` — deve deletar itens primeiro (FK), depois o pedido — também em transação

### 2.4 — CRUD de Itens de Pedido (sub-recurso)

- [ ] `GET /api/pedidos/:id/itens` — lista itens do pedido com join em produtos
- [ ] `POST /api/pedidos/:id/itens` — adiciona item avulso (pode ser fora de transação, pois o pedido já existe)
- [ ] `PUT /api/pedidos/:id/itens/:itemId` — atualiza `qtde` ou `preco` de um item
- [ ] `DELETE /api/pedidos/:id/itens/:itemId` — remove item (validar que o pedido não ficará sem itens; retornar 422 se for o último)

### 2.5 — Tratamento de erros global

- [ ] Registrar `fastify.setErrorHandler` para capturar erros não tratados e formatar resposta padrão: `{ error: true, message: '...' }`
- [ ] Criar helper `notFound` para 404s padronizados
- [ ] Mapear erros de FK do Postgres (`23503`) para 422 com mensagem legível

### 2.6 — Testes da API

- [ ] Configurar `vitest` com `supertest` apontando para a instância do Fastify (sem `listen` — usar `fastify.inject`)
- [ ] **Testes de Produtos:** criar, listar, atualizar, deletar, tentar deletar com item vinculado
- [ ] **Testes de Clientes:** criar, email duplicado deve retornar 422, deletar com pedido vinculado
- [ ] **Testes de Pedidos — transação:**
  - [ ] Criar pedido com itens válidos → 201, pedido e itens existem no banco
  - [ ] Criar pedido com `id_produto` inexistente → ROLLBACK, pedido **não** existe no banco (validar!)
  - [ ] Criar pedido sem itens → 400
- [ ] Rodar todos os testes: `npm test` deve passar com 0 falhas

---

## 📅 Dia 3 — Frontend: Produtos e Clientes

Com a API estável, o dia 3 é dedicado ao front-end das duas entidades mais simples. O objetivo é estabelecer os **componentes reutilizáveis** (DataTable, Modal, Form) que serão reaproveitados no dia 4 para Pedidos.

### 3.1 — Componentes base

- [ ] `BaseModal.vue` — modal com slot de conteúdo, props `title` e `open`, emit `close`
- [ ] `BaseDataTable.vue` — recebe `columns: []` e `rows: []`, renderiza tabela Tailwind responsiva com ações de editar/deletar por linha
- [ ] `BaseButton.vue` — botão com variantes `primary`, `danger`, `ghost`
- [ ] `BaseInput.vue` — input com label, mensagem de erro e bind de v-model
- [ ] `BaseDropdown.vue` — select estilizado com Tailwind, recebe `options: [{ value, label }]`
- [ ] `ConfirmDialog.vue` — modal de confirmação para deletes ("Tem certeza? Esta ação é irreversível.")

### 3.2 — Camada de API (axios)

- [ ] `src/api/produtos.js` — funções: `listar()`, `buscar(id)`, `criar(data)`, `atualizar(id, data)`, `deletar(id)`
- [ ] `src/api/clientes.js` — mesmas funções
- [ ] `src/api/pedidos.js` — funções: `listar()`, `buscar(id)`, `criar(data)`, `atualizar(id, data)`, `deletar(id)`, `listarItens(idPedido)`, `criarItem(idPedido, data)`, `atualizarItem(idPedido, idItem, data)`, `deletarItem(idPedido, idItem)`
- [ ] Criar `src/api/index.js` exportando a instância axios com `baseURL` vindo de `import.meta.env.VITE_API_URL`
- [ ] Adicionar interceptor de resposta para exibir mensagem de erro genérica em caso de falha de rede

### 3.3 — Página de Produtos

- [ ] `src/pages/Produtos.vue` — layout com título, botão "Novo Produto" e `BaseDataTable`
- [ ] Colunas da tabela: Nome, Preço (formatado em R$), Ações
- [ ] Ao clicar em "Novo Produto" → abre `BaseModal` com formulário de criação
- [ ] Ao clicar em editar → abre modal com formulário preenchido
- [ ] Ao clicar em deletar → abre `ConfirmDialog`, executa delete, mostra feedback de sucesso/erro
- [ ] Store Pinia `useProdutosStore` com estado `produtos: []`, actions `fetch`, `create`, `update`, `remove`
- [ ] Validação frontend: nome obrigatório, preço > 0

### 3.4 — Página de Clientes

- [ ] `src/pages/Clientes.vue` — mesma estrutura da página de Produtos
- [ ] Colunas: Nome, E-mail, Ações
- [ ] Validação frontend: nome obrigatório, e-mail em formato válido
- [ ] Store Pinia `useClientesStore`
- [ ] Tratar erro 422 (email duplicado) e exibir mensagem específica abaixo do campo

### 3.5 — Layout e navegação

- [ ] `src/components/AppLayout.vue` — sidebar ou navbar com links: Produtos, Clientes, Pedidos
- [ ] Indicador de rota ativa com Tailwind (`router-link-active`)
- [ ] Página 404 simples

---

## 📅 Dia 4 — Frontend: Pedidos, Itens e Fluxo Transacional

Este é o dia mais complexo do front-end. A tela de pedidos envolve **dois recursos criados simultaneamente** (pedido + itens), o que exige um formulário em múltiplas etapas ou um formulário único com lista de itens editáveis antes de submeter. Escolha o modelo de formulário único — é mais direto.

### 4.1 — Store de Pedidos

- [ ] `usePedidosStore` — estado: `pedidos: []`, `pedidoAtivo: null`, `itensDoPedido: []`
- [ ] Actions: `fetchPedidos`, `fetchPedido(id)`, `criarPedidoComItens(payload)`, `atualizarPedido`, `deletarPedido`
- [ ] Actions de itens: `fetchItens(idPedido)`, `adicionarItem`, `atualizarItem`, `removerItem`

### 4.2 — Página de Pedidos (listagem)

- [ ] `src/pages/Pedidos.vue` — tabela com colunas: Nº do Pedido, Data, Cliente, Total (calculado somando `qtde * preco` dos itens), Ações
- [ ] Botão "Novo Pedido" abre o modal/formulário de criação (ver 4.3)
- [ ] Clicar em qualquer linha → navega ou abre modal de visualização/edição do pedido com seus itens
- [ ] Dropdown de filtro por cliente no topo da tabela (filtra a listagem localmente com `computed`)

### 4.3 — Formulário de Criação de Pedido (formulário único com itens) ⚠️

Esta é a parte mais delicada do front-end. O payload enviado em `POST /api/pedidos` deve ter o pedido **e** os itens de uma só vez, pois a API garante a transação atômica.

- [ ] `PedidoForm.vue` — formulário com:
  - `BaseDropdown` para selecionar cliente (carrega lista de clientes ao montar)
  - Seção "Itens do Pedido" com tabela inline editável
  - Botão "Adicionar Item" → adiciona linha nova na tabela com `BaseDropdown` para produto e inputs de qtde/preço
  - Cada linha tem botão de remover
  - Total calculado em tempo real com `computed` (`sum(item.qtde * item.preco)`)
  - Botão "Salvar Pedido" → só habilitado se houver pelo menos 1 item e cliente selecionado
- [ ] Ao submeter, montar o payload: `{ id_cliente, itens: [...] }` e chamar `criarPedidoComItens`
- [ ] Se API retornar erro → exibir mensagem sem fechar o modal (usuário não perde o que digitou)
- [ ] Se sucesso → fechar modal, atualizar listagem, exibir toast de confirmação

### 4.4 — Modal de Visualização/Edição de Pedido

- [ ] `PedidoDetalhe.vue` — abre ao clicar num pedido existente
- [ ] Exibe dados do cabeçalho (cliente, data) com opção de editar
- [ ] Exibe `BaseDataTable` com os itens do pedido
- [ ] Permite adicionar novo item avulso (chama `POST /api/pedidos/:id/itens`)
- [ ] Permite editar qtde/preço de item existente
- [ ] Permite deletar item (com confirmação; desabilitar se for o último item)
- [ ] Total sempre atualizado em tempo real

### 4.5 — Testes de componentes (Vitest + Vue Test Utils)

- [ ] Instalar `@vue/test-utils`, `vitest`, `jsdom`
- [ ] `BaseModal.spec.js` — testa abertura, fechamento e slot de conteúdo
- [ ] `BaseDataTable.spec.js` — testa renderização de colunas e linhas
- [ ] `PedidoForm.spec.js` — testa: botão salvar desabilitado sem itens, total calculado corretamente, submit emite payload correto
- [ ] `Produtos.spec.js` — testa renderização da listagem mockando a store
- [ ] Rodar: `npm test` no diretório `web` deve passar com 0 falhas

---

## 📅 Dia 5 — Docker, Diagramas, Documentação e Polimento Final

O dia 5 é sobre transformar o que foi construído em algo que **qualquer pessoa consegue rodar com um único comando**. Sem isso, o projeto não está entregue.

### 5.1 — Docker e Docker Compose

- [ ] **`api/Dockerfile`:**
  ```dockerfile
  FROM node:20-alpine
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci --only=production
  COPY . .
  EXPOSE 3000
  CMD ["node", "src/server.js"]
  ```
- [ ] **`web/Dockerfile`** (build de produção servido por nginx):
  ```dockerfile
  FROM node:20-alpine AS build
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=build /app/dist /usr/share/nginx/html
  COPY nginx.conf /etc/nginx/conf.d/default.conf
  EXPOSE 80
  ```
- [ ] Criar `web/nginx.conf` com `try_files $uri /index.html` para suportar rotas do Vue Router
- [ ] **`docker-compose.yml` completo:**
  ```yaml
  services:
    postgres:
      image: postgres:16-alpine
      environment:
        POSTGRES_DB: vendify
        POSTGRES_USER: vendify
        POSTGRES_PASSWORD: vendify
      ports:
        - "5432:5432"
      volumes:
        - pg_data:/var/lib/postgresql/data

    api:
      build: ./api
      ports:
        - "3000:3000"
      environment:
        DATABASE_URL: postgres://vendify:vendify@postgres:5432/vendify
        NODE_ENV: production
      depends_on:
        - postgres

    web:
      build: ./web
      ports:
        - "8080:80"
      depends_on:
        - api

  volumes:
    pg_data:
  ```
- [ ] Criar `api/entrypoint.sh` que roda as migrations antes de iniciar o servidor (evita race condition com o postgres subindo)
- [ ] Testar o fluxo completo: `docker compose up --build` → abrir `localhost:8080` → criar produto, cliente e pedido com itens

### 5.2 — Arquivos de variável de ambiente

- [ ] `api/.env.example` com: `DATABASE_URL`, `PORT`, `NODE_ENV`
- [ ] `web/.env.example` com: `VITE_API_URL=http://localhost:3000`
- [ ] Confirmar que `.env` está no `.gitignore` e `.env.example` está no repositório

### 5.3 — Diagrama de Banco de Dados

- [ ] Criar o diagrama ERD em `docs/diagrama-erd.md` usando **Mermaid** (renderiza direto no GitHub):
  ```mermaid
  erDiagram
    CLIENTES ||--o{ PEDIDOS : "faz"
    PEDIDOS ||--|{ PEDIDO_ITENS : "contém"
    PRODUTOS ||--o{ PEDIDO_ITENS : "aparece em"

    CLIENTES { int id_cliente PK; varchar nome; varchar email }
    PRODUTOS { int id_produto PK; varchar nome; numeric preco }
    PEDIDOS { int id_pedido PK; timestamptz data; int id_cliente FK }
    PEDIDO_ITENS { int id_pedido_item PK; int id_pedido FK; int id_produto FK; int qtde; numeric preco }
  ```
- [ ] Exportar o diagrama como imagem PNG (via `mmdc` ou captura) para `docs/diagrama-erd.png`

### 5.4 — Documentação da API

- [ ] Criar `docs/api.md` com seções:
  - Visão geral e base URL
  - Para cada endpoint: método, path, body esperado (exemplo JSON), resposta de sucesso, possíveis erros
  - Seção especial **"Criação de Pedido — Transação Atômica"** explicando o contrato: se qualquer item falhar, o pedido inteiro é revertido
- [ ] Opcional mas recomendado: instalar `@fastify/swagger` + `@fastify/swagger-ui` e gerar documentação interativa em `/docs`

### 5.5 — Documentação do Frontend

- [ ] Criar `docs/frontend.md` cobrindo:
  - Estrutura de pastas e responsabilidade de cada diretório
  - Componentes reutilizáveis e suas props/emits
  - Como as stores Pinia se relacionam com a API
  - Fluxo de criação de pedido (diagrama de sequência simples em Mermaid)

### 5.6 — README principal (como rodar o projeto)

- [ ] Preencher o `README.md` raiz com as seções:
  - **Pré-requisitos:** Docker e Docker Compose instalados
  - **Como rodar (produção):**
    ```bash
    git clone https://github.com/seu-usuario/vendify.git
    cd vendify
    cp api/.env.example api/.env
    cp web/.env.example web/.env
    docker compose up --build
    # Acesse http://localhost:8080
    ```
  - **Como rodar (desenvolvimento local):**
    ```bash
    # Terminal 1 — banco
    docker compose up postgres

    # Terminal 2 — API
    cd api && npm install && npm run dev

    # Terminal 3 — Frontend
    cd web && npm install && npm run dev
    ```
  - **Como rodar os testes:**
    ```bash
    cd api && npm test
    cd web && npm test
    ```
  - Badge de status dos testes (GitHub Actions, opcional)

### 5.7 — Polimento e checklist final

- [ ] Testar o fluxo de ponta a ponta no ambiente Docker: criar produto → criar cliente → criar pedido com 3 itens → verificar total → editar item → deletar pedido
- [ ] Testar o cenário de falha transacional: tentar criar pedido com `id_produto: 999999` (inexistente) e confirmar que nenhum registro ficou no banco
- [ ] Verificar responsividade mínima das páginas em viewport mobile (375px)
- [ ] Conferir que não há `console.error` no navegador em fluxos normais
- [ ] Fazer push final e abrir o repositório público no GitHub
- [ ] Rever o `README.md` seguindo os passos do zero em uma máquina limpa (ou pedir para alguém testar)

---

## ⚠️ Notas Críticas da Sprint

**Sobre a transação atômica (o ponto mais importante da sprint):**
A regra é simples: o banco deve ser a última linha de defesa. O frontend nunca deve enviar pedido e itens em chamadas separadas — ele monta o payload completo e o backend é responsável por garantir a atomicidade. Se o processo for morto no meio do `INSERT`, o `ROLLBACK` automático do PostgreSQL ao fechar a conexão desfaz tudo. A única forma de ter "pai sem filho" é se alguém fizer um `COMMIT` antes de terminar todos os inserts — daí a importância de seguir o padrão `BEGIN → inserts todos → COMMIT` mostrado no Dia 2.

**Sobre a ordem de desenvolvimento:**
Não pule a criação dos seeds no Dia 1. Ter dados de teste reais desde o início economiza muitas horas de digitação manual ao longo da sprint.

**Sobre os testes:**
Os testes de transação no backend (Dia 2, seção 2.6) são os mais importantes do projeto. Um teste que confirma que o pedido **não existe** no banco após uma falha no insert de item é o único jeito de ter certeza que a transação funciona de verdade.
