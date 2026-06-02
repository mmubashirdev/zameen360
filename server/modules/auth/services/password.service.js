const bcrypt = require("bcryptjs");
const prisma = require("../../../configs/prisma");
const generateOTP = require("../../../utils/generateOTP");
const { sendPasswordResetEmail } = require("../../../utils/sendEmail");

const RESET_OTP_EXPIRY_MS = 60 * 1000;
const RESET_PASSWORD_WINDOW_MS = 10 * 60 * 1000;

const forgotPasswordService = async (email, ip) => {
  if (!email) throw { status: 400, message: "Email required." };

  const normalizedEmail = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) throw { status: 404, message: "User not found." };

  await prisma.userVerification.updateMany({
    where: {
      userId: user.id,
      otpType: "PASSWORD_RESET",
      isUsed: false,
    },
    data: { isUsed: true },
  });

  await prisma.passwordReset.updateMany({
    where: { userId: user.id, isUsed: false },
    data: { isUsed: true },
  });

  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + RESET_OTP_EXPIRY_MS);

  console.log("=== Generated OTP ===");
  console.log("Email:", normalizedEmail);
  console.log("OTP:", otp);
  console.log("Expiry:", otpExpiry);

  await prisma.userVerification.create({
    data: {
      userId: user.id,
      otpCode: String(otp),
      otpType: "PASSWORD_RESET",
      otpExpiry,
      ipAddress: ip,
    },
  });

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      resetToken: String(otp),
      tokenExpiry: otpExpiry,
      ipAddress: ip,
    },
  });

  await sendPasswordResetEmail(normalizedEmail, otp);

  await prisma.userActivityLog.create({
    data: {
      userId: user.id,
      action: "FORGOT_PASSWORD",
      description: "Password reset OTP requested",
      ipAddress: ip,
      status: "SUCCESS",
    },
  });

  return true;
};

const verifyResetOTPService = async (email, otpCode) => {
  if (!email || !otpCode) {
    throw { status: 400, message: "Email and OTP required." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const sanitizedOtpCode = String(otpCode).trim();

  console.log("=== Verify Reset OTP ===");
  console.log("Email:", normalizedEmail);
  console.log("OTP Code:", sanitizedOtpCode);
  console.log("OTP Type:", typeof otpCode);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) throw { status: 404, message: "User not found." };

  const verification = await prisma.userVerification.findFirst({
    where: {
      userId: user.id,
      otpCode: sanitizedOtpCode,
      otpType: "PASSWORD_RESET",
      isUsed: false,
      otpExpiry: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  console.log("Verification Found:", verification ? "YES" : "NO");

  if (!verification) {
    const latest = await prisma.userVerification.findFirst({
      where: {
        userId: user.id,
        otpType: "PASSWORD_RESET",
        isUsed: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (latest) {
      await prisma.userVerification.update({
        where: { id: latest.id },
        data: { attempts: latest.attempts + 1 },
      });
      console.log("Stored OTP:", latest.otpCode);
      console.log("Received OTP:", sanitizedOtpCode);
      console.log("Expiry:", latest.otpExpiry);
      console.log("Is Expired:", latest.otpExpiry < new Date());
    }

    throw { status: 400, message: "Invalid or expired OTP." };
  }

  const resetSession = await prisma.passwordReset.findFirst({
    where: {
      userId: user.id,
      resetToken: sanitizedOtpCode,
      isUsed: false,
      tokenExpiry: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!resetSession) {
    throw { status: 400, message: "Invalid or expired OTP." };
  }

  const resetAllowedUntil = new Date(Date.now() + RESET_PASSWORD_WINDOW_MS);
  const verifiedAt = new Date();

  await prisma.$transaction([
    prisma.userVerification.update({
      where: { id: verification.id },
      data: { verifiedAt },
    }),
    prisma.passwordReset.update({
      where: { id: resetSession.id },
      data: { tokenExpiry: resetAllowedUntil },
    }),
  ]);

  return {
    email: normalizedEmail,
    otpVerified: true,
    verificationId: verification.id,
    resetAllowedUntil: resetAllowedUntil.toISOString(),
  };
};

const resetPasswordService = async (data, ip) => {
  const { email, otpCode, newPassword, confirmPassword } = data;

  console.log("=== RESET PASSWORD START ===");
  console.log("Received Data:", {
    email,
    otpCode,
    newPassword: !!newPassword,
    confirmPassword: !!confirmPassword,
  });

  if (!email || !otpCode || !newPassword || !confirmPassword) {
    throw { status: 400, message: "All fields required." };
  }
  if (newPassword !== confirmPassword) {
    throw { status: 400, message: "Passwords don't match." };
  }
  if (newPassword.length < 8) {
    throw { status: 400, message: "Minimum 8 characters required." };
  }

  const normalizedEmail = email.toLowerCase().trim();
  const sanitizedOtpCode = String(otpCode).trim();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  console.log("User Found:", user ? user.id : "NOT FOUND");
  if (!user) throw { status: 404, message: "User not found." };

  const allOTPs = await prisma.userVerification.findMany({
    where: { userId: user.id, otpType: "PASSWORD_RESET" },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  console.log("=== ALL PASSWORD_RESET OTPs in DB ===");
  allOTPs.forEach((o, i) => {
    console.log(`OTP ${i + 1}:`, {
      id: o.id,
      storedOTP: o.otpCode,
      receivedOTP: sanitizedOtpCode,
      isMatch: o.otpCode === sanitizedOtpCode,
      isUsed: o.isUsed,
      expiry: o.otpExpiry,
      verifiedAt: o.verifiedAt,
      isExpired: o.otpExpiry < new Date(),
    });
  });

  const verification = await prisma.userVerification.findFirst({
    where: {
      userId: user.id,
      otpCode: sanitizedOtpCode,
      otpType: "PASSWORD_RESET",
      isUsed: false,
      verifiedAt: { not: null },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!verification) {
    throw {
      status: 400,
      message: "Please verify your OTP before resetting the password.",
    };
  }

  const resetSession = await prisma.passwordReset.findFirst({
    where: {
      userId: user.id,
      resetToken: sanitizedOtpCode,
      isUsed: false,
      tokenExpiry: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!resetSession) {
    throw {
      status: 400,
      message: "Your password reset session has expired. Please verify OTP again.",
    };
  }

  const salt = await bcrypt.genSalt(12);
  const hashed = await bcrypt.hash(newPassword, salt);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashed },
    }),
    prisma.userVerification.update({
      where: { id: verification.id },
      data: { isUsed: true },
    }),
    prisma.passwordReset.update({
      where: { id: resetSession.id },
      data: { isUsed: true, resetAt: new Date() },
    }),
    prisma.userSession.updateMany({
      where: { userId: user.id, isActive: true },
      data: { isActive: false, logoutTime: new Date() },
    }),
    prisma.userActivityLog.create({
      data: {
        userId: user.id,
        action: "RESET_PASSWORD",
        description: "Password reset successfully",
        ipAddress: ip,
        status: "SUCCESS",
      },
    }),
  ]);

  return true;
};

const changePasswordService = async (userId, passwordHash, data, ip) => {
  const { currentPassword, newPassword, confirmPassword } = data;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw { status: 400, message: "All fields required." };
  }

  if (newPassword !== confirmPassword) {
    throw { status: 400, message: "Passwords don't match." };
  }

  if (newPassword.length < 8) {
    throw { status: 400, message: "Minimum 8 characters required." };
  }

  const isValid = await bcrypt.compare(currentPassword, passwordHash);
  if (!isValid) {
    throw { status: 400, message: "Current password is incorrect." };
  }

  const salt = await bcrypt.genSalt(12);
  const hashed = await bcrypt.hash(newPassword, salt);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: hashed },
  });

  await prisma.userActivityLog.create({
    data: {
      userId,
      action: "CHANGE_PASSWORD",
      description: "Password changed successfully",
      ipAddress: ip,
      status: "SUCCESS",
    },
  });

  await prisma.userNotification.create({
    data: {
      userId,
      title: "Password Changed",
      message: "Your password has been changed successfully.",
      type: "SECURITY",
    },
  });

  return true;
};

module.exports = {
  forgotPasswordService,
  verifyResetOTPService,
  resetPasswordService,
  changePasswordService,
};
