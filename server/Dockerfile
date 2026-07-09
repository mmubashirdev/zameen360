FROM node:22-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5000

# Render will provide DATABASE_URL but not DIRECT_URL.
# Prisma schema expects DIRECT_URL too, so set it to DATABASE_URL by default.
CMD ["sh", "-c", "export DIRECT_URL=${DIRECT_URL:-$DATABASE_URL} && npx prisma migrate deploy && npm start"]
