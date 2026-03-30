# ---------- BASE ----------
FROM node:20-alpine

# Diretório da aplicação
WORKDIR /app

# Copia apenas arquivos de dependência (melhor cache)
COPY package.json package-lock.json ./

# Instala dependências
RUN npm ci

# Copia o restante do projeto
COPY . .

# Gera o client do Prisma (ESSENCIAL)
RUN npx prisma generate

# Expõe a porta do Fastify
EXPOSE 3333

# Comando de inicialização
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]