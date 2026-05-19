const service = require("../services/password.service");

exports.forgotPassword = async (req, res) => {
  try {
    await service.forgotPasswordService(req.body.email, req.ip);
    res.status(200).json({ success: true, message: "OTP sent to your email." });
  } catch (e) {
    console.error("forgotPassword error:", e);
    res.status(e.status || 500).json({ success: false, message: e.message });
  }
};

exports.verifyResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const otpCode = req.body.otpCode || req.body.otp;

    console.log("verifyResetOTP Request Body:", { email, otpCode });

    const data = await service.verifyResetOTPService(email, otpCode);
    res.status(200).json({ success: true, message: "OTP verified.", data });
  } catch (e) {
    console.error("verifyResetOTP error:", e);
    res.status(e.status || 500).json({ success: false, message: e.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    console.log("resetPassword Request Body:", {
      email: req.body.email,
      otpCode: req.body.otpCode,
      newPassword: req.body.newPassword ? "PROVIDED" : "MISSING",
      confirmPassword: req.body.confirmPassword ? "PROVIDED" : "MISSING",
    });

    await service.resetPasswordService(req.body, req.ip);
    res.status(200).json({ success: true, message: "Password reset successfully." });
  } catch (e) {
    console.error("resetPassword error:", e);
    res.status(e.status || 500).json({ success: false, message: e.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    await service.changePasswordService(
      req.user.id,
      req.user.passwordHash,
      req.body,
      req.ip
    );
    res.status(200).json({ success: true, message: "Password changed successfully." });
  } catch (e) {
    console.error("changePassword error:", e);
    res.status(e.status || 500).json({ success: false, message: e.message });
  }
};
