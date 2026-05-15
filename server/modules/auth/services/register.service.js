const bcrypt = require("bcryptjs");
const prisma = require("../../../configs/prisma");
const generateOTP = require("../../../utils/generateOTP");
const { sendOTPEmail } = require("../../../utils/sendEmail");

const registerUser = async (data, ip, userAgent) => {
  const { fullName, email, phone, password, confirmPassword, role, city } = data;

  // ── Validation ──────────────────────────────────────────
  if (!fullName) throw { status: 400, message: "Full name required." };
  if (!email) throw { status: 400, message: "Email required." };
  if (!password) throw { status: 400, message: "Password required." };
  if (!confirmPassword) throw { status: 400, message: "Confirm password required." };

  if (password !== confirmPassword) {
    throw { status: 400, message: "Passwords don't match." };
  }
  if (password.length < 8) {
    throw { status: 400, message: "Password min 8 characters." };
  }

  // ── Normalize email ─────────────────────────────────────
  const normalizedEmail = email.toLowerCase().trim();

  // ── Check if email exists ───────────────────────────────
  const existing = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existing) {
    // ✅ NEW LOGIC: If user is NOT verified, delete and re-register
    if (!existing.isVerified) {
      console.log(`🔄 Unverified user found, deleting old record: ${normalizedEmail}`);

      // Delete all related data (cascade)
      await prisma.$transaction([
        prisma.userVerification.deleteMany({ where: { userId: existing.id } }),
        prisma.userActivityLog.deleteMany({ where: { userId: existing.id } }),
        prisma.userProfile.deleteMany({ where: { userId: existing.id } }),
        prisma.sellerDetail.deleteMany({ where: { userId: existing.id } }),
        prisma.userSession.deleteMany({ where: { userId: existing.id } }),
        prisma.user.delete({ where: { id: existing.id } }),
      ]);

      console.log(`✅ Old unverified user deleted, proceeding with fresh registration`);
    } else {
      // ✅ User is verified - block registration
      throw {
        status: 400,
        message: "Email already registered. Please login instead.",
      };
    }
  }

  // ── Hash Password ───────────────────────────────────────
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const userRole = role === "SELLER" ? "SELLER" : "BUYER";

  // ── Create User (fresh) ─────────────────────────────────
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

  // ── Parallel DB Operations ──────────────────────────────
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
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
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

  // ── Email background mein ───────────────────────────────
  sendOTPEmail(normalizedEmail, otp, "Email Verification").catch((err) =>
    console.error("Email failed:", err.message)
  );

  return {
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    isVerified: false,
  };
};

module.exports = { registerUser };