const { Router } = require("express");
const {
  sendMessage,
  deleteSession,
  getChatHistory,
  healthCheck,
} = require("../controller/chat.controller");

const router = Router();


router.get("/health", healthCheck);
router.post("/message", sendMessage);
router.get("/history/:sessionId", getChatHistory);
router.delete("/session/:sessionId", deleteSession);

module.exports = router;