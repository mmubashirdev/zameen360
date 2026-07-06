const prisma = require("../../../configs/prisma");

class MessageService {
  async getUserConversations(userId) {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ buyerId: userId }, { sellerId: userId }],
      },
      include: {
        buyer: { select: { id: true, fullName: true, profilePicture: true, lastActiveAt: true } },
        seller: { select: { id: true, fullName: true, profilePicture: true, lastActiveAt: true } },
        property: { select: { id: true, title: true, images: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        _count: {
          select: {
            messages: {
              where: {
                senderId: { not: userId },
                isRead: false,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    // Flatten _count into a top-level unreadCount field
    return conversations.map((c) => ({
      ...c,
      unreadCount: c._count?.messages ?? 0,
      _count: undefined,
    }));
  }

  async getTotalUnreadCount(userId) {
    const count = await prisma.message.count({
      where: {
        senderId: { not: userId },
        isRead: false,
        conversation: {
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
      },
    });
    return count;
  }

  async getConversationMessages(conversationId) {
    const messages = await prisma.message.findMany({
      where: { conversationId: Number(conversationId) },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, fullName: true, profilePicture: true, lastActiveAt: true } },
      },
    });
    return messages;
  }

  async sendMessage({ senderId, receiverId, propertyId, text, isVoice, voiceUrl, voiceDuration, conversationId, mediaUrl, mediaType }) {
    let conversation;
    let resolvedReceiverId;

    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: Number(conversationId) },
      });
      if (!conversation) throw new Error("Conversation not found");

      // Determine the other party
      resolvedReceiverId =
        Number(conversation.buyerId) === Number(senderId)
          ? Number(conversation.sellerId)
          : Number(conversation.buyerId);
    } else {
      // receiverId must be provided for a new conversation
      if (!receiverId) throw new Error("receiverId is required for a new conversation");

      resolvedReceiverId = Number(receiverId);

      // Find existing conversation between these two users (for this property if given)
      conversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            { buyerId: Number(senderId), sellerId: resolvedReceiverId },
            { buyerId: resolvedReceiverId, sellerId: Number(senderId) },
          ],
          ...(propertyId ? { propertyId: Number(propertyId) } : {}),
        },
      });

      if (!conversation) {
        conversation = await prisma.conversation.create({
          data: {
            buyerId: Number(senderId),
            sellerId: resolvedReceiverId,
            propertyId: propertyId ? Number(propertyId) : null,
          },
        });
      }
    }

    const message = await prisma.message.create({
      data: {
        conversationId: Number(conversation.id),
        senderId: Number(senderId),
        text,
        isVoice: isVoice || false,
        voiceUrl: voiceUrl || null,
        voiceDuration: voiceDuration || null,
        mediaUrl: mediaUrl || null,
        mediaType: mediaType || null,
      },
      include: {
        sender: { select: { id: true, fullName: true, profilePicture: true } },
      },
    });

    await prisma.conversation.update({
      where: { id: Number(conversation.id) },
      data: { updatedAt: new Date() },
    });

    return { message, conversation, receiverId: resolvedReceiverId };
  }

  async markAsRead(conversationId, userId) {
    const messagesToRead = await prisma.message.findMany({
      where: {
        conversationId: Number(conversationId),
        senderId: { not: Number(userId) },
        isRead: false,
      },
      select: {
        id: true,
        senderId: true,
      },
    });

    if (messagesToRead.length === 0) return [];

    await prisma.message.updateMany({
      where: {
        conversationId: Number(conversationId),
        senderId: { not: Number(userId) },
        isRead: false,
      },
      data: { isRead: true },
    });

    return messagesToRead;
  }
}

module.exports = new MessageService();