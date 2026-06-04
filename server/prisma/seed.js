const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin123@", 10);

  await prisma.user.upsert({
    where: {
      email: "admin@zameen360.com",
    },
    update: {},
    create: {
      fullName: "System Admin",
      email: "admin@zameen360.com",
      passwordHash: hashedPassword,
      role: "ADMIN",
      isVerified: true,
      isActive: true,
    },
  });

  console.log("Admin created successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
