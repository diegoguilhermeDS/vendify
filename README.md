<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/diegoguilhermeDS/vendify?color=%2304D361">

  <img alt="Repository size" src="https://img.shields.io/github/repo-size/diegoguilhermeDS/vendify">

  <a href="https://github.com/diegoguilhermeDS/vendify/commits/main">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/diegoguilhermeDS/vendify">
  </a>

  <a href="https://github.com/diegoguilhermeDS/vendify/blob/main/LICENSE">
    <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
  </a>

  <a href="https://github.com/diegoguilhermeDS">
    <img alt="Feito por Diego Guilherme" src="https://img.shields.io/badge/feito%20por-Diego%20Guilherme-%237519C1">
  </a>
</p>

<h1 align="center">Vendify</h1>

<p align="center">
  Plataforma para gerenciamento de produtos com API moderna, interface web responsiva e banco de dados PostgreSQL.
</p>

<p align="center">
  <a href="#-sobre-o-projeto">Sobre</a> •
  <a href="#-funcionalidades">Funcionalidades</a> •
  <a href="#-tecnologias">Tecnologias</a> •
  <a href="#-como-executar-o-projeto">Como executar</a> •
  <a href="#-autor">Autor</a> •
  <a href="#-licença">Licença</a>
</p>

---

## 💻 Sobre o projeto

**Vendify** é uma aplicação full stack desenvolvida para gerenciamento de produtos, com foco em organização, produtividade e simplicidade de uso.

O projeto é dividido em duas partes:

- **API** em Fastify + Prisma + PostgreSQL
- **Web** em Vue 3 + Vite + Tailwind CSS

A proposta é oferecer uma base sólida para cadastro, edição, exclusão e listagem de produtos, com validação, tipagem e uma experiência de uso limpa.

---

## ✨ Funcionalidades

- Cadastro de produtos
- Edição de produtos
- Exclusão de produtos
- Listagem com interface organizada
- Validação de dados no front e na API
- Persistência em banco PostgreSQL
- Estrutura preparada para evolução do front e da API
- Documentação da API via Swagger

---

## 🚀 Tecnologias

### Backend
- Fastify
- TypeScript
- Prisma
- PostgreSQL
- Zod
- Swagger / Swagger UI
- Vitest

### Frontend
- Vue 3
- Vite
- TypeScript
- Tailwind CSS
- Pinia
- Vue Router
- Vee Validate
- Zod
- Axios
- TanStack Table

### Infraestrutura
- Docker
- Docker Compose

---

## 📦 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)

Também é recomendado ter um editor como o [VS Code](https://code.visualstudio.com/).

---

## 🧭 Como executar o projeto

### 1. Clone o repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd vendify

````
### 2. Configure as variáveis de ambiente

Crie os arquivos `.env` na raiz da API e do projeto, conforme sua estrutura.

#### Exemplo para a API
```env
PORT=3333
DATABASE_URL=postgres://user:password@localhost:5432/vendify
DATABASE_URL_TEST=postgres://user_test:password_test@localhost:5433/vendify_test
````

#### Exemplo para o Docker Compose

```env
POSTGRES_DB=vendify
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres

POSTGRES_DB_TEST=vendify_test
POSTGRES_USER_TEST=postgres
POSTGRES_PASSWORD_TEST=postgres
```

---

### 3. Subindo com Docker

O `docker-compose.yml` atual sobe:

* PostgreSQL principal
* PostgreSQL de testes
* API

```bash
docker compose up --build
```

A API ficará disponível em:

```bash
http://localhost:3333
```

---

### 4. Rodando a API localmente

Entre na pasta da API e instale as dependências:

```bash
cd api
npm install
```

#### Comandos disponíveis

```bash
npm run dev
npm run build
npm run start
npm run test
```

---

### 5. Rodando o front-end localmente

Entre na pasta do front e instale as dependências:

```bash
cd web
npm install
npm run dev
```

A aplicação web ficará disponível em:

```bash
http://localhost:5173
```

---

## 🧪 Testes

Para rodar os testes da API:

```bash
cd api
npm run test
```

---

## 📁 Estrutura do projeto

```bash
vendify/
├── api/
│   ├── src/
│   ├── prisma/
│   └── package.json
├── web/
│   ├── src/
│   └── package.json
├── docker-compose.yml
└── README.md
```

---

## 🦸 Autor

Desenvolvido por **Diego Guilherme**.

[![Linkedin Badge](https://img.shields.io/badge/-Diego-blue?style=flat-square\&logo=Linkedin\&logoColor=white)](https://www.linkedin.com/in/diegoguilhermeds/)
[![Gmail Badge](https://img.shields.io/badge/-diegoguilherme752@gmail.com-c14438?style=flat-square\&logo=Gmail\&logoColor=white)](mailto:diegoguilherme752@gmail.com)

---

## 📝 Licença

Este projeto está sob a licença [MIT](./LICENSE).

---

<p align="center">
  Feito com 💜 por Diego Guilherme
</p>
```
