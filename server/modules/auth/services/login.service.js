const bcrypt = require("bcryptjs");
const prisma = require("../../../configs/prisma");
const { generateAccessToken, generateRefreshToken } = require("../../../utils/generateToken");

const loginUser = async (data, ip, userAgent) => {
  const { email, password, rememberMe } = data;

  if (!email || !password) {
    throw { status: 400, message: "Email and password required." };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true, sellerDetail: true, trustScoreData: true },
  });

  if (!user) throw { status: 401, message: "Invalid credentials." };

  const isValid = await bcrypt.compare(password, user.passwordHash);

  if (!isValid) {
    await prisma.userActivityLog.create({
      data: {
        userId: user.id,
        action: "LOGIN_FAILED",
        description: "Wrong password",
        ipAddress: ip,
        device: userAgent,
        status: "FAILED",
      },
    });
    throw { status: 401, message: "Invalid credentials." };
  }

  if (!user.isActive) {
    throw { status: 403, message: "Account deactivated." };
  }

  // ❌ OTP verification check REMOVED - login allowed without verification
  // if (!user.isVerified) { ... }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  await prisma.userSession.create({
    data: {
      userId: user.id,
      sessionToken: accessToken,
      deviceType: userAgent || "unknown",
      browser: userAgent || "unknown",
      ipAddress: ip,
      isActive: true,
      rememberMe: rememberMe || false,
    },
  });

  await prisma.userProfile.updateMany({
    where: { userId: user.id },
    data: { lastLogin: new Date() },
  });

  await prisma.userActivityLog.create({
    data: {
      userId: user.id,
      action: "LOGIN",
      description: "Logged in",
      ipAddress: ip,
      device: userAgent,
      status: "SUCCESS",
    },
  });

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      city: user.city,
      isVerified: user.isVerified,
      profile: user.profile,
      sellerDetail: user.sellerDetail,
    },
    accessToken,
    refreshToken,
  };
};

const adminLoginService = async (data, ip) => {
  // ... same as before
};

module.exports = { loginUser, adminLoginService };