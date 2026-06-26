const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const authMiddleware = require("../../auth/middlewares/auth.middleware");

console.log("Payment routes loaded");

// ─── Public ──────────────────────────────────────────────────────────────────
router.get("/plans", paymentController.getPlans);

// ─── Protected ───────────────────────────────────────────────────────────────
router.post("/checkout", authMiddleware, paymentController.createCheckout);
router.get("/history", authMiddleware, paymentController.getMyPayments);
router.get(
  "/verify/:sessionId",
  authMiddleware,
  paymentController.verifyPayment,
);

module.exports = router;
