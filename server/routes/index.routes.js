const { Router } = require("express");
const authRoutes = require("../modules/auth/routes/index.js");
const router = Router();

router.use("/auth", authRoutes);

module.exports = router;
