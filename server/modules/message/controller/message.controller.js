const messageService = require("../services/message.service");
const { uploadToCloudinary } = require("../../../utils/uploadToCloudinary");
class MessageController {
  async getConversations(req, res) {
    try {
      const userId = req.user.id;
      const conversations = await messageService.getUserConversations(userId);

      const onlineUsers = req.app.get("onlineUsers") || new Map();
      const onlineUserIds = new Set(onlineUsers.values());

      const updatedConversations = conversations.map((c) => {
        if (c.buyer) c.buyer.isOnline = onlineUserIds.has(c.buyer.id);
        if (c.seller) c.seller.isOnline = onlineUserIds.has(c.seller.id);
        return c;
      });

      res.status(200).json({ success: true, data: updatedConversations });
    } catch (error) {
      console.error("Error in getConversations:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getUnreadCount(req, res) {
    try {
      const userId = req.user.id;
      const count = await messageService.getTotalUnreadCount(userId);
      res.status(200).json({ success: true, data: { count } });
    } catch (error) {
      console.error("Error in getUnreadCount:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const messages =
        await messageService.getConversationMessages(conversationId);
      await messageService.markAsRead(conversationId, req.user.id);

      const onlineUsers = req.app.get("onlineUsers") || new Map();
      const onlineUserIds = new Set(onlineUsers.values());

      const updatedMessages = messages.map((m) => {
        if (m.sender) m.sender.isOnline = onlineUserIds.has(m.sender.id);
        return m;
      });

      res.status(200).json({ success: true, data: updatedMessages });
    } catch (error) {
      console.error("Error in getMessages:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Upload image or video file for chat messages
  async uploadMedia(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded" });
      }

       if (!req.file.buffer || req.file.buffer.length === 0) {
         return res.status(400).json({
           success: false,
           message: "File buffer is empty. Upload failed.",
         });
       }


      const { mimetype, size, filename, buffer } = req.file;
      const isImage = mimetype.startsWith("image/");
      const isVideo = mimetype.startsWith("video/");

      // Enforce 5 MB limit for images
      if (isImage && size > 5 * 1024 * 1024) {
        return res
          .status(400)
          .json({ success: false, message: "Image must be under 5 MB" });
      }

      const folder = isVideo ? "zameen360/messages/videos" : "zameen360/messages/images"
      const mediaUrl = await uploadToCloudinary(buffer, folder);
      const mediaType = isImage ? "image" : isVideo ? "video" : "file";

      res.status(200).json({ success: true, data: { mediaUrl, mediaType } });
    } catch (error) {
      console.error("Error in uploadMedia:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async sendMessage(req, res) {
    try {
      const senderId = req.user.id;
      const {
        receiverId,
        propertyId,
        text,
        isVoice,
        voiceUrl,
        voiceDuration,
        conversationId,
        mediaUrl,
        mediaType,
      } = req.body;

      if (!receiverId && !conversationId) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Receiver ID or Conversation ID is required",
          });
      }

      const {
        message,
        conversation,
        receiverId: actualReceiverId,
      } = await messageService.sendMessage({
        senderId,
        receiverId: receiverId ? Number(receiverId) : undefined,
        propertyId,
        text,
        isVoice,
        voiceUrl,
        voiceDuration,
        conversationId,
        mediaUrl,
        mediaType,
      });

      // Force numbers so socket room names are always "user_123" not "user_BigInt"
      const receiverIdNum = Number(actualReceiverId);
      const senderIdNum = Number(senderId);
      const conversationIdNum = Number(conversation.id);

      const io = req.app.get("io");
      if (io) {
        const payload = { message, conversationId: conversationIdNum };
        console.log(
          `📡 Emitting receive_message to user_${receiverIdNum} and user_${senderIdNum}`,
        );
        // Send to receiver — they get the message in real time
        io.to(`user_${receiverIdNum}`).emit("receive_message", payload);
        // Send back to sender — so their sidebar preview updates on other tabs/devices
        io.to(`user_${senderIdNum}`).emit("receive_message", payload);
      } else {
        console.log(`⚠️ IO not found in req.app!`);
      }

      res.status(201).json({
        success: true,
        data: { message, conversationId: conversationIdNum },
      });
    } catch (error) {
      console.error("Error in sendMessage:", error);
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new MessageController();
