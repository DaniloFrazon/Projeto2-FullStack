# backend/Dockerfile (Versão Padrão Otimizada)

FROM node:20-alpine AS builder

WORKDIR /app

# 1. Copia apenas os arquivos de dependência
COPY package*.json ./ 

# 2. Instala as dependências (Camada de Cache)
RUN npm install 

# --------------------------
# Fase de Execução (Runtime)
# --------------------------
FROM node:20-alpine

WORKDIR /app

# 3. Copia a pasta node_modules instalada na fase 'builder'
COPY --from=builder /app/node_modules ./node_modules 

# 4. Copia o código-fonte (Isso cria um conflito resolvível)
COPY . . 

EXPOSE 3000
CMD ["node", "server.js"]