FROM node:22-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5000

CMD ["sh", "-c", "npm ci && npx prisma generate && npm run dev"]