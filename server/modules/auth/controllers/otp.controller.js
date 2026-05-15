const service = require("../services/otp.service");

exports.sendOTP = async (req, res) => {
  try {
    await service.sendOTPService(req.body.email, req.ip);
    res.status(200).json({ success: true, message: "OTP sent." });
  } catch (e) {
    res.status(e.status || 500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    // ✅ Accept both 'otp' and 'otpCode' for compatibility
    const otpCode = req.body.otpCode || req.body.otp;
    
    const data = await service.verifyOTPService(
      req.body.email,
      otpCode,
      req.ip,
      req.headers["user-agent"]
    );
    res.status(200).json({ success: true, message: "Verified.", data });
  } catch (e) {
    res.status(e.status || 500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.resendOTP = (req, res) => exports.sendOTP(req, res);