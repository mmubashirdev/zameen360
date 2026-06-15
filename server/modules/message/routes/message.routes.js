const express = require("express");
const router = express.Router();
const messageController = require("../controller/message.controller");
const authMiddleware = require("../../auth/middlewares/auth.middleware");
const { uploadMessageMedia } = require("../middleware/messageUpload");

// All message routes require authentication
router.use(authMiddleware);

// Get all conversations for the logged-in user
router.get("/conversations", messageController.getConversations);

// Get total unread message count for the logged-in user
router.get("/unread-count", messageController.getUnreadCount);

// Upload image or video for a chat message
router.post("/upload-media", uploadMessageMedia.single("media"), messageController.uploadMedia);

// Get messages for a specific conversation
router.get("/:conversationId", messageController.getMessages);

// Send a new message
router.post("/", messageController.sendMessage);

module.exports = router;

