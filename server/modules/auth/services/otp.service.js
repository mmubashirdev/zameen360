const prisma = require("../../../configs/prisma");
const generateOTP = require("../../../utils/generateOTP");
const { sendOTPEmail, sendWelcomeEmail } = require("../../../utils/sendEmail");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../../utils/generateToken");

// ─── Send OTP (also used for resend) ─────────────────────────────────────────

const sendOTPService = async (email, ip) => {
  if (!email) throw { status: 400, message: "Email required." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: "User not found." };

  const otp = generateOTP();

  // ✅ Step 1: INVALIDATE all old OTPs first (sequential to ensure order)
  await prisma.userVerification.updateMany({
    where: {
      userId: user.id,
      isUsed: false,
    },
    data: { isUsed: true },
  });

  // ✅ Step 2: Create new OTP
  await prisma.userVerification.create({
    data: {
      userId: user.id,
      otpCode: otp,
      otpType: "EMAIL",
      otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
      ipAddress: ip,
    },
  });

  // ✅ Step 3: Send email in background
  sendOTPEmail(email, otp, "Email Verification")
    .then(() => console.log(`✅ OTP sent to ${email}`))
    .catch((err) => console.error(`❌ Email failed:`, err.message));

  return true;
};

// ─── Verify OTP - STRICT validation ──────────────────────────────────────────

const verifyOTPService = async (email, otpCode, ip, userAgent) => {
  if (!email || !otpCode) {
    throw { status: 400, message: "Email and OTP required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: "User not found." };

  // ✅ STEP 1: Find LATEST OTP record (regardless of status)
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

  // ✅ STEP 2: Check if already used (old OTP after resend)
  if (latestOtp.isUsed) {
    throw {
      status: 400,
      message: "This code is no longer valid. Please use the latest code sent to your email.",
    };
  }

  // ✅ STEP 3: Check if matches
  if (latestOtp.otpCode !== otpCode) {
    // Increment attempts
    await prisma.userVerification.update({
      where: { id: latestOtp.id },
      data: { attempts: latestOtp.attempts + 1 },
    });

    throw { status: 400, message: "Invalid OTP code." };
  }

  // ✅ STEP 4: Check expiry
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

  // ✅ STEP 5: Valid OTP - Generate tokens
  const accessToken = generateAccessToken(user.id, user.role);
  const refreshToken = generateRefreshToken(user.id, user.role);

  // ✅ STEP 6: Mark as used + verify user
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

  // ✅ Send welcome email in background
  sendWelcomeEmail(email, user.fullName)
    .then(() => console.log(`✅ Welcome email sent to ${email}`))
    .catch((err) => console.error(`❌ Welcome email failed:`, err.message));

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