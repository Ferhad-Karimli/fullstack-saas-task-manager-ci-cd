FROM node:20-alpine

WORKDIR /app

# əvvəl package faylları
COPY package*.json ./
RUN npm ci --omit=dev

# sonra kod
COPY . .

ENV NODE_ENV=production
EXPOSE 3001

CMD ["node", "src/index.js"]
