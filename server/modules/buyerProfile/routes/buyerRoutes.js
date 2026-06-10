const express = require("express");
const router = express.Router();
const buyerController = require("../controllers/buyerController");
const authMiddleware = require("../../auth/middlewares/auth.middleware");

router.get("/profile", authMiddleware, buyerController.getProfile);
router.put("/profile", authMiddleware, buyerController.updateProfile);
router.post("/switch-to-seller", authMiddleware, buyerController.switchToSeller);
router.get("/activity", authMiddleware, buyerController.getActivity);

module.exports = router;