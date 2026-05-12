const bcrypt = require("bcryptjs");
const prisma = require("../../../configs/prisma");
const generateOTP = require("../../../utils/generateOTP");
const { sendOTPEmail } = require("../../../utils/sendEmail");
const { generateAccessToken, generateRefreshToken } = require("../../../utils/generateToken");



const loginUser = async (data, ip, userAgent) => {
  const { email, password, rememberMe } = data;
  if (!email || !password) throw { status: 400, message: "Email and password required." };

  const user = await prisma.user.findUnique({ where: { email }, include: { profile: true, sellerDetail: true, trustScoreData: true } });
  if (!user) throw { status: 401, message: "Invalid credentials." };

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    await prisma.userActivityLog.create({ data: { userId: user.id, action: "LOGIN_FAILED", description: "Wrong password", ipAddress: ip, device: userAgent, status: "FAILED" } });
    throw { status: 401, message: "Invalid credentials." };
  }

  if (!user.isActive) throw { status: 403, message: "Account deactivated." };

  if (!user.isVerified) {
    const otp = generateOTP();
    await prisma.userVerification.create({ data: { userId: user.id, otpCode: otp, otpType: "EMAIL", otpExpiry: new Date(Date.now() + 10 * 60 * 1000), ipAddress: ip } });
    await sendOTPEmail(email, otp, "Email Verification");
    throw { status: 403, message: "Email not verified. New OTP sent.", requiresVerification: true };
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  await prisma.userSession.create({ data: { userId: user.id, sessionToken: accessToken, deviceType: userAgent || "unknown", browser: userAgent || "unknown", ipAddress: ip, isActive: true, rememberMe: rememberMe || false } });
  await prisma.userProfile.updateMany({ where: { userId: user.id }, data: { lastLogin: new Date() } });
  await prisma.userActivityLog.create({ data: { userId: user.id, action: "LOGIN", description: "Logged in", ipAddress: ip, device: userAgent, status: "SUCCESS" } });
  await prisma.userNotification.create({ data: { userId: user.id, title: "Login", message: `Logged in from ${ip}`, type: "SECURITY" } });

  return {
    user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, role: user.role, city: user.city, profilePicture: user.profilePicture, isVerified: user.isVerified, trustScore: user.trustScore, profile: user.profile, sellerDetail: user.sellerDetail },
    accessToken, refreshToken,
  };
};

const adminLoginService = async (data, ip) => {
  const { email, password } = data;
  if (!email || !password) throw { status: 400, message: "Required." };

  const admin = await prisma.user.findUnique({ where: { email } });
  if (!admin || admin.role !== "ADMIN") throw { status: 401, message: "Invalid admin credentials." };

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) throw { status: 401, message: "Invalid admin credentials." };

  const accessToken = generateAccessToken(admin.id, admin.role);
  const refreshToken = generateRefreshToken(admin.id, admin.role);

  await prisma.userSession.create({ data: { userId: admin.id, sessionToken: accessToken, deviceType: "admin_panel", ipAddress: ip, isActive: true } });
  await prisma.userActivityLog.create({ data: { userId: admin.id, action: "ADMIN_LOGIN", description: "Admin logged in", ipAddress: ip, status: "SUCCESS" } });

  return { admin: { id: admin.id, fullName: admin.fullName, email: admin.email, role: admin.role }, accessToken, refreshToken };
};

module.exports = { loginUser, adminLoginService };