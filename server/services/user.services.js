import prisma from "../configs/db.js";

const createUserService = async (data) => {
  return await prisma.user.create({
    data,
  });
};

export default { createUserService };
