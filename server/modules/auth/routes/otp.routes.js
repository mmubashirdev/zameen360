const router = require("express").Router();

const otpController = require("../controllers/otp.controller");

router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);
router.post("/resend-otp", otpController.resendOTP);

module.exports = router;
