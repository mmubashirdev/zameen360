const prisma = require("../../../configs/prisma");
const generateOTP = require("../../../utils/generateOTP");
const { sendOTPEmail, sendWelcomeEmail } = require("../../../utils/sendEmail");
const { generateAccessToken, generateRefreshToken } = require("../../../utils/generateToken");
const sendOTPService = async (email, ip) => {
  if (!email) throw { status: 400, message: "Email required." };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: "User not found." };

  await prisma.userVerification.updateMany({ where: { userId: user.id, isUsed: false }, data: { isUsed: true } });

  const otp = generateOTP();
  await prisma.userVerification.create({ data: { userId: user.id, otpCode: otp, otpType: "EMAIL", otpExpiry: new Date(Date.now() + 10 * 60 * 1000), ipAddress: ip } });
  await sendOTPEmail(email, otp, "Email Verification");
  return true;
};

const verifyOTPService = async (email, otpCode, ip, userAgent) => {
  if (!email || !otpCode) throw { status: 400, message: "Email and OTP required." };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: "User not found." };

  const verification = await prisma.userVerification.findFirst({
    where: { userId: user.id, otpCode, isUsed: false, otpExpiry: { gte: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!verification) {
    const latest = await prisma.userVerification.findFirst({ where: { userId: user.id, isUsed: false }, orderBy: { createdAt: "desc" } });
    if (latest) await prisma.userVerification.update({ where: { id: latest.id }, data: { attempts: latest.attempts + 1 } });
    throw { status: 400, message: "Invalid or expired OTP." };
  }

  await prisma.userVerification.update({ where: { id: verification.id }, data: { isUsed: true, verifiedAt: new Date() } });
  await prisma.user.update({ where: { id: user.id }, data: { isVerified: true } });
  await sendWelcomeEmail(email, user.fullName);

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  await prisma.userSession.create({ data: { userId: user.id, sessionToken: accessToken, deviceType: userAgent || "unknown", ipAddress: ip, isActive: true } });
  await prisma.userActivityLog.create({ data: { userId: user.id, action: "VERIFY_OTP", description: "Email verified", ipAddress: ip, status: "SUCCESS" } });

  return { user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role, isVerified: true }, accessToken, refreshToken };
};

module.exports = { sendOTPService, verifyOTPService };