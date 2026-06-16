import { MessageCircle, ShieldCheck, Mail, ArrowRight, CheckCheck } from "lucide-react";
import type { ReactNode } from "react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import socket from "@shared/lib/socket";
import axiosInstance from "@shared/lib/axios";
import { useAuthContext } from "@features/auth/hooks/useAuth";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MessageNotification {
  id: number;
  conversationId: number;
  senderId: number;
  text?: string;
  mediaType?: string;
  createdAt: string;
  isUnread: boolean;
  sender?: {
    id: number;
    fullName: string;
    profilePicture?: string;
  };
}

interface NotificationDropdownProps {
  onClose?: () => void;
  onMarkAllRead?: () => void;
  onViewAll?: () => void;
}

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

// ─── Component ────────────────────────────────────────────────────────────────
const NotificationDropdown = ({
  onMarkAllRead,
  onViewAll,
}: NotificationDropdownProps) => {
  const [notifications, setNotifications] = useState<MessageNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuthContext();
  const navigate = useNavigate();

  // ─── Fetch unread message notifications from conversations ─────────────────
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const result: any = await axiosInstance.get("/messages/conversations");
      if (result.success) {
        const myId = Number(currentUser?.userId || currentUser?.id);
        const notifs: MessageNotification[] = [];

        result.data.forEach((conv: any) => {
          const unreadCount = conv.unreadCount ?? 0;
          if (unreadCount > 0 && conv.messages?.[0]) {
            const lastMsg = conv.messages[0];
            const otherUser =
              Number(conv.buyerId) === myId ? conv.seller : conv.buyer;

            notifs.push({
              id: lastMsg.id,
              conversationId: conv.id,
              senderId: otherUser?.id,
              text: lastMsg.text,
              mediaType: lastMsg.mediaType,
              createdAt: lastMsg.createdAt,
              isUnread: true,
              sender: otherUser,
            });
          }
        });

        // Most recent first
        notifs.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(notifs);
      }
    } catch (err) {
      console.error("fetchNotifications error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.userId, currentUser?.id]);

  // ─── Fetch on mount ────────────────────────────────────────────────────────
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ─── Real-time socket updates ──────────────────────────────────────────────
  useEffect(() => {
    if (!(currentUser?.userId || currentUser?.id)) return;
    const myId = Number(currentUser?.userId || currentUser?.id);

    const onReceiveMessage = (data: {
      message: any;
      conversationId: number;
    }) => {
      // Only handle messages from OTHER users
      if (Number(data.message.senderId) === myId) return;

      const newNotif: MessageNotification = {
        id: data.message.id,
        conversationId: data.conversationId,
        senderId: data.message.senderId,
        text: data.message.text,
        mediaType: data.message.mediaType,
        createdAt: data.message.createdAt,
        isUnread: true,
        sender: data.message.sender,
      };

      setNotifications((prev) => {
        // Update existing conversation entry or prepend new one
        const existingIdx = prev.findIndex(
          (n) => n.conversationId === data.conversationId
        );
        if (existingIdx !== -1) {
          const updated = [...prev];
          updated[existingIdx] = newNotif;
          return updated.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return [newNotif, ...prev];
      });
    };

    socket.on("receive_message", onReceiveMessage);
    return () => {
      socket.off("receive_message", onReceiveMessage);
    };
  }, [currentUser?.userId, currentUser?.id]);

  // ─── Listen for read events from ChatWindow ────────────────────────────────
  useEffect(() => {
    const handleMarkedRead = () => {
      fetchNotifications();
    };
    window.addEventListener("messages_marked_read", handleMarkedRead);
    return () =>
      window.removeEventListener("messages_marked_read", handleMarkedRead);
  }, [fetchNotifications]);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const formatTime = (date: string): string => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffMs = now.getTime() - msgDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays === 1) return "Yesterday";
    return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const getMessagePreview = (notif: MessageNotification): string => {
    if (notif.mediaType === "image") return "sent you an image.";
    if (notif.mediaType === "video") return "sent you a video.";
    if (notif.text) return notif.text;
    return "sent you a message.";
  };

  // ─── Click a notification → go to that conversation ───────────────────────
  const handleNotificationClick = (notif: MessageNotification) => {
    // Remove from local list optimistically
    setNotifications((prev) =>
      prev.filter((n) => n.conversationId !== notif.conversationId)
    );
    onClose?.();
    navigate("/messages", {
      state: { openConversationId: notif.conversationId },
    });
  };

  // ─── Mark all as read ──────────────────────────────────────────────────────
  const handleMarkAllRead = () => {
    setNotifications([]);
    onMarkAllRead?.();
  };

  // ─── Render avatar/icon for a notification ─────────────────────────────────
  const renderIcon = (notif: MessageNotification): ReactNode => (
    <div className="relative shrink-0">
      <img
        src={notif.sender?.profilePicture || DEFAULT_AVATAR}
        alt={notif.sender?.fullName || "User"}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = DEFAULT_AVATAR;
        }}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1 rounded-full border-2 border-white">
        <MessageCircle className="w-3 h-3 text-white fill-white" />
      </div>
    </div>
  );

  // ─── onClose prop workaround (used in handleNotificationClick) ────────────
  const onClose = onViewAll
    ? () => {
        /* will be overridden per-call */
      }
    : undefined;

  return (
    <div className="absolute right-0 top-12 w-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
          {notifications.length > 0 && (
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {notifications.length} new
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm font-medium text-blue-500 hover:text-blue-600 transition"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* ── Notification List ───────────────────────────────────────────────── */}
      <div className="max-h-[480px] overflow-y-auto">
        
        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-1 px-4 pb-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                  <div className="h-2.5 bg-gray-100 rounded w-4/5" />
                  <div className="h-2 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>

        ) : notifications.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
              <CheckCheck className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-600">
              All caught up!
            </p>
            <p className="text-xs text-gray-400">No unread messages</p>
          </div>

        ) : (
          /* Notification items */
          notifications.map((notif) => (
            <div
              key={`${notif.conversationId}-${notif.id}`}
              onClick={() => handleNotificationClick(notif)}
              className="flex items-start gap-3 px-6 py-4 hover:bg-gray-50 cursor-pointer transition"
            >
              {renderIcon(notif)}

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm text-gray-900 mb-1">
                  {notif.sender?.fullName || "Unknown User"}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-2 truncate">
                  {getMessagePreview(notif)}
                </p>
                <p className="text-xs text-gray-400">
                  {formatTime(notif.createdAt)}
                </p>
              </div>

              {/* Unread dot */}
              {notif.isUnread && (
                <div className="shrink-0 mt-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full block" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="p-4">
        <button
          onClick={() => {
            onViewAll?.();
          }}
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-500 font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition"
        >
          View all messages
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;