const bcrypt = require("bcryptjs");
const prisma = require("../../../configs/prisma");
const generateOTP = require("../../../utils/generateOTP");
const { sendPasswordResetEmail } = require("../../../utils/sendEmail");

// ✅ Forgot Password - OTP generate karke email bhejo
const forgotPasswordService = async (email, ip) => {
  if (!email) throw { status: 400, message: "Email required." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: "User not found." };

  // ✅ Purane unused OTPs mark as used
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
  const otpExpiry = new Date(Date.now() + 60 * 1000); // 60 seconds

  console.log("=== Generated OTP ===");
  console.log("Email:", email);
  console.log("OTP:", otp);
  console.log("Expiry:", otpExpiry);

  // ✅ Naya OTP save karo
  await prisma.userVerification.create({
    data: {
      userId: user.id,
      otpCode: String(otp), // ✅ String ensure karo
      otpType: "PASSWORD_RESET",
      otpExpiry,
      ipAddress: ip,
    },
  });

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      resetToken: String(otp), // ✅ String ensure karo
      tokenExpiry: otpExpiry,
      ipAddress: ip,
    },
  });

  await sendPasswordResetEmail(email, otp);

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

// ✅ Verify OTP - Sirf check karo, mark as used mat karo (reset password mein hoga)
const verifyResetOTPService = async (email, otpCode) => {
  if (!email || !otpCode) throw { status: 400, message: "Email and OTP required." };

  console.log("=== Verify Reset OTP ===");
  console.log("Email:", email);
  console.log("OTP Code:", otpCode);
  console.log("OTP Type:", typeof otpCode);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: "User not found." };

  const verification = await prisma.userVerification.findFirst({
    where: {
      userId: user.id,
      otpCode: String(otpCode).trim(), // ✅ String trim karo
      otpType: "PASSWORD_RESET",
      isUsed: false,
      otpExpiry: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  console.log("Verification Found:", verification ? "YES" : "NO");

  if (!verification) {
    // ✅ Failed attempt log karo
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
      console.log("Received OTP:", otpCode);
      console.log("Expiry:", latest.otpExpiry);
      console.log("Is Expired:", latest.otpExpiry < new Date());
    }

    throw { status: 400, message: "Invalid or expired OTP." };
  }

  // ✅ Sirf verify karo, isUsed: true mat karo abhi
  // Reset password step mein mark hoga
  return {
    email,
    otpVerified: true,
    verificationId: verification.id, // ✅ ID return karo
  };
};

// ✅ Reset Password
const resetPasswordService = async (data, ip) => {
  const { email, otpCode, newPassword, confirmPassword } = data;

  console.log("=== RESET PASSWORD START ===");
  console.log("Received Data:", { email, otpCode, newPassword: !!newPassword, confirmPassword: !!confirmPassword });

  if (!email || !otpCode || !newPassword || !confirmPassword) {
    throw { status: 400, message: "All fields required." };
  }
  if (newPassword !== confirmPassword) {
    throw { status: 400, message: "Passwords don't match." };
  }
  if (newPassword.length < 8) {
    throw { status: 400, message: "Minimum 8 characters required." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  console.log("User Found:", user ? user.id : "NOT FOUND");
  if (!user) throw { status: 404, message: "User not found." };

  // ✅ Debug logging
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
      receivedOTP: otpCode,
      isMatch: o.otpCode === String(otpCode).trim(),
      isUsed: o.isUsed,
      expiry: o.otpExpiry,
      isExpired: o.otpExpiry < new Date(),
    });
  });

  // Find valid verification record
  const v = await prisma.userVerification.findFirst({
    where: {
      userId: user.id,
      otpCode: String(otpCode).trim(),
      otpType: "PASSWORD_RESET",
      isUsed: false,
      otpExpiry: { gte: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!v) {
    throw { status: 400, message: "Invalid or expired OTP." };
  }

  const salt = await bcrypt.genSalt(12);
  const hashed = await bcrypt.hash(newPassword, salt);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: hashed },
    }),
    prisma.userVerification.update({
      where: { id: v.id },
      data: { isUsed: true, verifiedAt: new Date() },
    }),
    prisma.passwordReset.updateMany({
      where: { userId: user.id, resetToken: String(otpCode).trim(), isUsed: false },
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
    prisma.userNotification.create({
      data: {
        userId: user.id,
        title: "Password Changed",
        message: "Your password has been reset successfully.",
        type: "SECURITY",
      },
    }),
  ]);

  return true;
};


// ✅ Change Password (Logged in user ke liye)
const changePasswordService = async (userId, passwordHash, data, ip) => {
  const { currentPassword, newPassword, confirmPassword } = data;

  if (!currentPassword || !newPassword || !confirmPassword)
    throw { status: 400, message: "All fields required." };

  if (newPassword !== confirmPassword)
    throw { status: 400, message: "Passwords don't match." };

  if (newPassword.length < 8)
    throw { status: 400, message: "Minimum 8 characters required." };

  const isValid = await bcrypt.compare(currentPassword, passwordHash);
  if (!isValid) throw { status: 400, message: "Current password is incorrect." };

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