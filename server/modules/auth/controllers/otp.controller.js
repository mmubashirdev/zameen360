const service = require("../services/otp.service");

exports.sendOTP = async (req, res) => {
  try {
    const data = await service.sendOTPService(req.body.email, req.ip);
    res.status(200).json({ success: true, message: "OTP sent.", data });
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
    
    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      secure: "true",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      secure: "true",
      path: "/api/auth/refresh",
      maxAge: 15 * 60 * 1000,
    });

    const responseData = { ...data };
    delete responseData.accessToken;
    delete responseData.refreshToken;

    res.status(200).json({ success: true, message: "Verified.", data: responseData });
  } catch (e) {
    res.status(e.status || 500).json({
      success: false,
      message: e.message,
    });
  }
};

exports.resendOTP = (req, res) => exports.sendOTP(req, res);
