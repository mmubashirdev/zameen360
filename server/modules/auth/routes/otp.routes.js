const router = require("express").Router();

const otpController = require("../controllers/otp.controller");
const forgotPasswordController = require("../controllers/forgetPassword.controller");
const c = require("../controllers/otp.controller");
router.post("/send-otp", c.sendOTP);
router.post("/verify-otp", c.verifyOTP);
router.post("/resend-otp", c.resendOTP);

// Email verification (registration)
router.post("/verify-otp", otpController.verifyOTP);

// ✅ Password reset OTP - separate controller
router.post("/verify-reset-otp", forgotPasswordController.verifyResetOtp);
module.exports = router;