const bcrypt = require("bcryptjs");
const prisma = require("../../../configs/prisma");
const generateOTP = require("../../../utils/generateOTP");
const { sendOTPEmail } = require("../../../utils/sendEmail");

const EMAIL_OTP_EXPIRY_MS = 60 * 1000;
const RESEND_OTP_COOLDOWN_MS = 60 * 1000;

const registerUser = async (data, ip, userAgent) => {
  const { fullName, email, phone, password, confirmPassword, role, city } = data;

  if (!fullName) throw { status: 400, message: "Full name required." };
  if (!email) throw { status: 400, message: "Email required." };
  if (!password) throw { status: 400, message: "Password required." };
  if (!confirmPassword) {
    throw { status: 400, message: "Confirm password required." };
  }

  if (password !== confirmPassword) {
    throw { status: 400, message: "Passwords don't match." };
  }
  if (password.length < 8) {
    throw { status: 400, message: "Password min 8 characters." };
  }

  const normalizedEmail = email.toLowerCase().trim();

  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    throw {
      status: 409,
      message: existing.isVerified
        ? "Email already registered. Please login instead."
        : "Email already exists. Please verify your email or use a different email.",
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userRole = role === "SELLER" ? "SELLER" : "BUYER";

  const user = await prisma.user.create({
    data: {
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone ? phone.trim() : null,
      passwordHash: hashedPassword,
      role: userRole,
      city: city || null,
      isVerified: false,
      isActive: true,
    },
  });

  const otp = generateOTP();
  const now = Date.now();
  const otpExpiry = new Date(now + EMAIL_OTP_EXPIRY_MS);
  const resendAvailableAt = new Date(now + RESEND_OTP_COOLDOWN_MS);

  await Promise.all([
    prisma.userProfile.create({
      data: { userId: user.id, profileComplete: false },
    }),
    userRole === "SELLER"
      ? prisma.sellerDetail.create({ data: { userId: user.id } })
      : Promise.resolve(),
    prisma.userVerification.create({
      data: {
        userId: user.id,
        otpCode: otp,
        otpType: "EMAIL",
        otpExpiry,
        ipAddress: ip,
      },
    }),
    prisma.userActivityLog.create({
      data: {
        userId: user.id,
        action: "REGISTER",
        description: `Registered as ${userRole}`,
        ipAddress: ip,
        device: userAgent,
        status: "SUCCESS",
      },
    }),
  ]);

  sendOTPEmail(normalizedEmail, otp, "Email Verification").catch((err) =>
    console.error("Email failed:", err.message)
  );

  return {
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isVerified: false,
    otpExpiresAt: otpExpiry.toISOString(),
    resendAvailableAt: resendAvailableAt.toISOString(),
  };
};

module.exports = { registerUser };
