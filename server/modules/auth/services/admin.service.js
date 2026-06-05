const prisma = require("../../../configs/prisma");

// const AdminLogin = async (email, password) => {
//   const adminDetails = prisma.admin.findUnique({
//     where: {
//       email,
//       role:"ADMIN"
//     },
//   });
//   if (!admin) {
//     throw new Error("Admin not found");
//   }
//   if (admin.password !== password) {
//     throw new Error("Invalid Password");
//   }
//   return admin;
// };

const getAllUsersService = async (query) => {
  const { role, status, search, page = 1, limit = 10 } = query;
  const where = {};
  if (role) where.role = role;
  if (status === "active") where.isActive = true;
  if (status === "blocked") where.isActive = false;
  if (search)
    where.OR = [
      { fullName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: { profile: true, sellerDetail: true, trustScoreData: true },
      skip,
      take: parseInt(limit),
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);
  return {
    users,
    pagination: {
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / parseInt(limit)),
    },
  };
};

const getUserByIdService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
    include: {
      profile: true,
      sellerDetail: true,
      trustScoreData: true,
      activityLogs: { orderBy: { createdAt: "desc" }, take: 20 },
      sessions: { orderBy: { loginTime: "desc" }, take: 10 },
    },
  });
  if (!user) throw { status: 404, message: "Not found." };
  return user;
};

const blockUserService = async (userId, reason, ip) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
  if (!user) throw { status: 404, message: "Not found." };
  if (user.role === "ADMIN")
    throw { status: 400, message: "Cannot block admin." };
  await prisma.user.update({
    where: { id: parseInt(userId) },
    data: { isActive: false },
  });
  await prisma.userSession.updateMany({
    where: { userId: parseInt(userId), isActive: true },
    data: { isActive: false, logoutTime: new Date() },
  });
  await prisma.userNotification.create({
    data: {
      userId: parseInt(userId),
      title: "Blocked",
      message: `Reason: ${reason || "Policy violation"}`,
      type: "SECURITY",
    },
  });
  await prisma.userActivityLog.create({
    data: {
      userId: parseInt(userId),
      action: "BLOCKED",
      description: `Reason: ${reason}`,
      ipAddress: ip,
      status: "SUCCESS",
    },
  });
  return user.fullName;
};

const unblockUserService = async (userId, ip) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
  if (!user) throw { status: 404, message: "Not found." };
  await prisma.user.update({
    where: { id: parseInt(userId) },
    data: { isActive: true },
  });
  await prisma.userNotification.create({
    data: {
      userId: parseInt(userId),
      title: "Unblocked",
      message: "Account unblocked.",
      type: "SECURITY",
    },
  });
  await prisma.userActivityLog.create({
    data: {
      userId: parseInt(userId),
      action: "UNBLOCKED",
      description: "By admin",
      ipAddress: ip,
      status: "SUCCESS",
    },
  });
  return user.fullName;
};

const deleteUserService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId) },
  });
  if (!user) throw { status: 404, message: "Not found." };
  if (user.role === "ADMIN")
    throw { status: 400, message: "Cannot delete admin." };
  await prisma.user.delete({ where: { id: parseInt(userId) } });
  return user.fullName;
};

const getUserStatsService = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [
    total,
    buyers,
    sellers,
    admins,
    active,
    blocked,
    verified,
    unverified,
    newToday,
    newWeek,
    newMonth,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "BUYER" } }),
    prisma.user.count({ where: { role: "SELLER" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.user.count({ where: { isActive: true } }),
    prisma.user.count({ where: { isActive: false } }),
    prisma.user.count({ where: { isVerified: true } }),
    prisma.user.count({ where: { isVerified: false } }),
    prisma.user.count({ where: { createdAt: { gte: today } } }),
    prisma.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);
  return {
    total,
    byRole: { buyers, sellers, admins },
    byStatus: { active, blocked },
    byVerification: { verified, unverified },
    newRegistrations: {
      today: newToday,
      thisWeek: newWeek,
      thisMonth: newMonth,
    },
  };
};

module.exports = {
  getAllUsersService,
  getUserByIdService,
  blockUserService,
  unblockUserService,
  deleteUserService,
  getUserStatsService,
};
