const service = require("../services/password.service");

exports.forgotPassword = async (req, res) => {
  try { await service.forgotPasswordService(req.body.email, req.ip); res.status(200).json({ success: true, message: "OTP sent." }); }
  catch (e) { res.status(e.status || 500).json({ success: false, message: e.message }); }
};

exports.verifyResetOTP = async (req, res) => {
  try { const data = await service.verifyResetOTPService(req.body.email, req.body.otpCode); res.status(200).json({ success: true, message: "Verified.", data }); }
  catch (e) { res.status(e.status || 500).json({ success: false, message: e.message }); }
};

exports.resetPassword = async (req, res) => {
  try { await service.resetPasswordService(req.body, req.ip); res.status(200).json({ success: true, message: "Password reset." }); }
  catch (e) { res.status(e.status || 500).json({ success: false, message: e.message }); }
};

exports.changePassword = async (req, res) => {
  try { await service.changePasswordService(req.user.id, req.user.passwordHash, req.body, req.ip); res.status(200).json({ success: true, message: "Changed." }); }
  catch (e) { res.status(e.status || 500).json({ success: false, message: e.message }); }
};