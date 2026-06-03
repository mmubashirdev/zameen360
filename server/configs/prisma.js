const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["info", "warn", "error"],
  errorFormat: "pretty"
});

prisma.$connect()
  .then(() => console.log("DB connected via Prisma"))
  .catch(err => {
    console.error("DB connection error:", err);
    process.exit(1);
  });

module.exports = prisma;