const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

prisma.$connect()
  .then(() => console.log("DB connected via Prisma"))
  .catch(err => console.error("DB connection error:", err));

module.exports = prisma;