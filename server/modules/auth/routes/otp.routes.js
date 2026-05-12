const router = require("express").Router();
const c = require("../controllers/otp.controller");
router.post("/send-otp", c.sendOTP);
router.post("/verify-otp", c.verifyOTP);
router.post("/resend-otp", c.resendOTP);
module.exports = router;