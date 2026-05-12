const bcrypt = require("bcryptjs");
const prisma = require("../../../configs/prisma");
const generateOTP = require("../../../utils/generateOTP");
const { sendPasswordResetEmail } = require("../../../utils/sendEmail");

const forgotPasswordService = async (email, ip) => {
  if (!email) throw { status: 400, message: "Email required." };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: "Not found." };

  await prisma.passwordReset.updateMany({ where: { userId: user.id, isUsed: false }, data: { isUsed: true } });
  const otp = generateOTP();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.userVerification.create({ data: { userId: user.id, otpCode: otp, otpType: "PASSWORD_RESET", otpExpiry, ipAddress: ip } });
  await prisma.passwordReset.create({ data: { userId: user.id, resetToken: otp, tokenExpiry: otpExpiry, ipAddress: ip } });
  await sendPasswordResetEmail(email, otp);
  await prisma.userActivityLog.create({ data: { userId: user.id, action: "FORGOT_PASSWORD", description: "Reset requested", ipAddress: ip, status: "SUCCESS" } });
  return true;
};

const verifyResetOTPService = async (email, otpCode) => {
  if (!email || !otpCode) throw { status: 400, message: "Required." };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: "Not found." };

  const v = await prisma.userVerification.findFirst({ where: { userId: user.id, otpCode, otpType: "PASSWORD_RESET", isUsed: false, otpExpiry: { gte: new Date() } }, orderBy: { createdAt: "desc" } });
  if (!v) throw { status: 400, message: "Invalid or expired OTP." };
  return { email, otpVerified: true };
};

const resetPasswordService = async (data, ip) => {
  const { email, otpCode, newPassword, confirmPassword } = data;
  if (!email || !otpCode || !newPassword || !confirmPassword) throw { status: 400, message: "All fields required." };
  if (newPassword !== confirmPassword) throw { status: 400, message: "Don't match." };
  if (newPassword.length < 8) throw { status: 400, message: "Min 8 chars." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 404, message: "Not found." };

  const v = await prisma.userVerification.findFirst({ where: { userId: user.id, otpCode, otpType: "PASSWORD_RESET", isUsed: false, otpExpiry: { gte: new Date() } }, orderBy: { createdAt: "desc" } });
  if (!v) throw { status: 400, message: "Invalid OTP." };

  const hashed = await bcrypt.hash(newPassword, await bcrypt.genSalt(12));
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: hashed } });
  await prisma.userVerification.update({ where: { id: v.id }, data: { isUsed: true, verifiedAt: new Date() } });
  await prisma.passwordReset.updateMany({ where: { userId: user.id, resetToken: otpCode, isUsed: false }, data: { isUsed: true, resetAt: new Date() } });
  await prisma.userSession.updateMany({ where: { userId: user.id, isActive: true }, data: { isActive: false, logoutTime: new Date() } });
  await prisma.userActivityLog.create({ data: { userId: user.id, action: "RESET_PASSWORD", description: "Password reset", ipAddress: ip, status: "SUCCESS" } });
  await prisma.userNotification.create({ data: { userId: user.id, title: "Password Changed", message: "Password reset successfully.", type: "SECURITY" } });
  return true;
};

const changePasswordService = async (userId, passwordHash, data, ip) => {
  const { currentPassword, newPassword, confirmPassword } = data;
  if (!currentPassword || !newPassword || !confirmPassword) throw { status: 400, message: "Required." };
  if (newPassword !== confirmPassword) throw { status: 400, message: "Don't match." };
  if (newPassword.length < 8) throw { status: 400, message: "Min 8 chars." };

  const isValid = await bcrypt.compare(currentPassword, passwordHash);
  if (!isValid) throw { status: 400, message: "Wrong current password." };

  const hashed = await bcrypt.hash(newPassword, await bcrypt.genSalt(12));
  await prisma.user.update({ where: { id: userId }, data: { passwordHash: hashed } });
  await prisma.userActivityLog.create({ data: { userId, action: "CHANGE_PASSWORD", description: "Changed", ipAddress: ip, status: "SUCCESS" } });
  await prisma.userNotification.create({ data: { userId, title: "Password Changed", message: "Changed successfully.", type: "SECURITY" } });
  return true;
};

module.exports = { forgotPasswordService, verifyResetOTPService, resetPasswordService, changePasswordService };