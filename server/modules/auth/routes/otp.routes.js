const router = require("express").Router();

const otpController = require("../controllers/otp.controller");
const forgotPasswordController = require("../controllers/forgetPassword.controller");

router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);
router.post("/resend-otp", otpController.resendOTP);

// ✅ Password reset OTP - separate controller
router.post("/verify-reset-otp", forgotPasswordController.verifyResetOtp);

module.exports = router;