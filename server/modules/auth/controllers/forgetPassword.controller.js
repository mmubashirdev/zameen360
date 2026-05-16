const prisma = require("../../../configs/prisma");

exports.verifyResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const otpCode = req.body.otpCode || req.body.otp;

    console.log("🔍 Verify Reset OTP:", { email, otpCode });

    if (!email || !otpCode) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find latest OTP
    const latestOtp = await prisma.userVerification.findFirst({
      where: {
        userId: user.id,
        otpType: "PASSWORD_RESET",
      },
      orderBy: { createdAt: "desc" },
    });

    if (!latestOtp) {
      return res.status(400).json({
        success: false,
        message: "No verification code found. Please request a new code.",
      });
    }

    if (latestOtp.isUsed) {
      return res.status(400).json({
        success: false,
        message: "This code is no longer valid. Please use the latest code.",
      });
    }

    if (String(latestOtp.otpCode).trim() !== String(otpCode).trim()) {
      await prisma.userVerification.update({
        where: { id: latestOtp.id },
        data: { attempts: latestOtp.attempts + 1 },
      });
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code.",
      });
    }

    if (latestOtp.otpExpiry < new Date()) {
      await prisma.userVerification.update({
        where: { id: latestOtp.id },
        data: { isUsed: true },
      });
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new code.",
      });
    }

    // ✅ Mark verified but DON'T mark used yet
    await prisma.userVerification.update({
      where: { id: latestOtp.id },
      data: { verifiedAt: new Date() },
    });

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (e) {
    console.error("❌ Verify Reset OTP Error:", e);
    res.status(500).json({
      success: false,
      message: e.message || "Verification failed",
    });
  }
};