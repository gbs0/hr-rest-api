# Etapa de build
FROM node:20-alpine AS builder

# Cria o diretório de trabalho
WORKDIR /app

# Copia o package.json e o package-lock.json (ou yarn.lock / pnpm-lock.yaml)
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o código para o container
COPY . .

# Compila o TypeScript (se tiver script "build")
RUN npm run build

# Etapa final
FROM node:20-alpine

WORKDIR /app

# Copia apenas o necessário para rodar
COPY package*.json ./

# Instala apenas as dependências de produção
RUN npm clean-install

# Copia o build gerado e outras partes importantes
COPY --from=builder /app/.env ./ # caso precise de um .env (opcional)

# Inicia a aplicação
CMD ["npm", "run", "start"]

# Expõe a porta que a aplicação usa
EXPOSE 3333
