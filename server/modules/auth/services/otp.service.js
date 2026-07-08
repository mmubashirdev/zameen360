const prisma = require("../../../configs/prisma");
const generateOTP = require("../../../utils/generateOTP");
const { sendOTPEmail, sendWelcomeEmail } = require("../../../utils/sendEmail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../utils/generateToken");

const EMAIL_OTP_EXPIRY_MS = 60 * 1000;
const RESEND_OTP_COOLDOWN_MS = 60 * 1000;

const sendOTPService = async (email, ip) => {
  if (!email) throw { status: 400, message: "Email required." };

  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) throw { status: 404, message: "User not found." };

  const otp = generateOTP();
  const now = Date.now();
  const otpExpiry = new Date(now + EMAIL_OTP_EXPIRY_MS);
  const resendAvailableAt = new Date(now + RESEND_OTP_COOLDOWN_MS);

  await prisma.userVerification.updateMany({
    where: {
      userId: user.id,
      isUsed: false,
    },
    data: { isUsed: true },
  });

  await prisma.userVerification.create({
    data: {
      userId: user.id,
      otpCode: otp,
      otpType: "EMAIL",
      otpExpiry,
      ipAddress: ip,
    },
  });

  sendOTPEmail(normalizedEmail, otp, "Email Verification")
    .then(() => console.log(`OTP sent to ${normalizedEmail}`))
    .catch((err) => console.error("Email failed:", err.message));

  return {
    otpExpiresAt: otpExpiry.toISOString(),
    resendAvailableAt: resendAvailableAt.toISOString(),
  };
};

const verifyOTPService = async (email, otpCode, ip, userAgent) => {
  if (!email || !otpCode) {
    throw { status: 400, message: "Email and OTP required." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (!user) throw { status: 404, message: "User not found." };

  const latestOtp = await prisma.userVerification.findFirst({
    where: {
      userId: user.id,
      otpType: "EMAIL",
    },
    orderBy: { createdAt: "desc" },
  });

  if (!latestOtp) {
    throw {
      status: 400,
      message: "No verification code found. Please request a new code.",
    };
  }

  if (latestOtp.isUsed) {
    throw {
      status: 400,
      message: "This code is no longer valid. Please use the latest code sent to your email.",
    };
  }

  if (latestOtp.otpExpiry < new Date()) {
    await prisma.userVerification.update({
      where: { id: latestOtp.id },
      data: { isUsed: true },
    });

    throw {
      status: 400,
      message: "Verification code has expired. Please request a new code.",
    };
  }

  if (latestOtp.otpCode !== otpCode) {
    await prisma.userVerification.update({
      where: { id: latestOtp.id },
      data: { attempts: latestOtp.attempts + 1 },
    });

    throw { status: 400, message: "Invalid OTP code." };
  }

  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  await Promise.all([
    prisma.userVerification.update({
      where: { id: latestOtp.id },
      data: { isUsed: true, verifiedAt: new Date() },
    }),
    prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    }),
    prisma.userSession.create({
      data: {
        userId: user.id,
        sessionToken: accessToken,
        deviceType: userAgent || "unknown",
        ipAddress: ip,
        isActive: true,
      },
    }),
    prisma.userActivityLog.create({
      data: {
        userId: user.id,
        action: "VERIFY_OTP",
        description: "Email verified",
        ipAddress: ip,
        status: "SUCCESS",
      },
    }),
  ]);

  sendWelcomeEmail(normalizedEmail, user.fullName)
    .then(() => console.log(`Welcome email sent to ${normalizedEmail}`))
    .catch((err) => console.error("Welcome email failed:", err.message));

  return {
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isVerified: true,
    },
    accessToken,
    refreshToken,
  };
};

module.exports = { sendOTPService, verifyOTPService };
