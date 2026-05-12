const router = require("express").Router();
const c = require("../controllers/password.controller");
const auth = require("../middlewares/auth.middleware");
router.post("/forgot-password", c.forgotPassword);
router.post("/verify-reset-otp", c.verifyResetOTP);
router.post("/reset-password", c.resetPassword);
router.put("/change-password", auth, c.changePassword);
module.exports = router;