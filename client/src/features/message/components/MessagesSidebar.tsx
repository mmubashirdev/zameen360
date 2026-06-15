import { useState, useEffect, useRef, useCallback } from "react";
import { MoreHorizontal, Search, SlidersHorizontal } from "lucide-react";
import axiosInstance from "@shared/lib/axios";
import socket from "@shared/lib/socket";
import { useAuthContext } from "@features/auth/hooks/useAuth";
import { formatLastActive } from "@shared/utils/helpers";

export interface Conversation {
  id: number;
  buyerId: number;
  sellerId: number;
  propertyId: number | null;
  buyer: { id: number; fullName: string; profilePicture?: string; lastActiveAt?: string };
  seller: { id: number; fullName: string; profilePicture?: string; lastActiveAt?: string };
  messages: { text: string; createdAt: string; isVoice: boolean; mediaType?: string }[];
  updatedAt: string;
}

interface MessagesSidebarProps {
  selectedConversationId: number | null;
  onSelectConversation: (id: number) => void;
  newConversationContext?: { sellerId: number; propertyId: number } | null;
  refreshTrigger?: number;
}

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const MessagesSidebar = ({
  selectedConversationId,
  onSelectConversation,
  newConversationContext,
  refreshTrigger = 0,
}: MessagesSidebarProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  // Per-conversation unread counts (keyed by conversation id)
  const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
  const [userStatuses, setUserStatuses] = useState<Record<number, { isOnline: boolean; lastActiveAt: string | null }>>({});

  const newConvCtxRef = useRef(newConversationContext);
  const selectedIdRef = useRef(selectedConversationId);
  useEffect(() => { newConvCtxRef.current = newConversationContext; }, [newConversationContext]);
  useEffect(() => { selectedIdRef.current = selectedConversationId; }, [selectedConversationId]);

  const fetchConversations = useCallback(async () => {
    try {
      const result: any = await axiosInstance.get("/messages/conversations");
      if (result.success) {
        const fetchedConvs: Conversation[] = result.data;
        setConversations(fetchedConvs);

        // Seed unread counts from server response
        const counts: Record<number, number> = {};
        fetchedConvs.forEach((c: any) => {
          counts[c.id] = c.unreadCount ?? 0;
        });
        setUnreadCounts(counts);

        // Auto-select if we came from a property page and conversation already exists
        const ctx = newConvCtxRef.current;
        if (ctx && !selectedIdRef.current) {
          const match = fetchedConvs.find(
            (c) =>
              (c.sellerId === ctx.sellerId && c.buyerId === Number(currentUser?.userId || currentUser?.id)) ||
              (c.buyerId === ctx.sellerId && c.sellerId === Number(currentUser?.userId || currentUser?.id))
          );
          if (match) onSelectConversation(match.id);
        }
      }
    } catch (err) {
      console.error("fetchConversations error:", err);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch on mount and on parent-triggered refresh
  useEffect(() => {
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  const { user: currentUser } = useAuthContext();

  // ─── Socket ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!(currentUser?.userId || currentUser?.id)) return;

    // Ensure we are connected and joined to the user room
    const onConnect = () => {
      const id = currentUser?.userId || currentUser?.id;
      socket.emit("join_user_room", Number(id));
    };

    socket.on("connect", onConnect);

    if (!socket.connected) {
      socket.connect();
    } else {
      const id = currentUser?.userId || currentUser?.id;
      socket.emit("join_user_room", Number(id));
    }

    const onReceiveMessage = (data: { message: any; conversationId: number }) => {
      const myId = currentUser?.userId || currentUser?.id;

      setConversations((prev) => {
        const idx = prev.findIndex((c) => Number(c.id) === Number(data.conversationId));
        if (idx !== -1) {
          // Update preview text and float to top
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            messages: [{
              text: data.message.text || "",
              createdAt: data.message.createdAt,
              isVoice: data.message.isVoice || false,
            }],
            updatedAt: data.message.createdAt,
          };
          const [conv] = updated.splice(idx, 1);
          return [conv, ...updated];
        }
        // Brand-new conversation (receiver sees it for the first time) — full refetch
        fetchConversations();
        return prev;
      });

      // Increment unread count if:
      // - message is from the OTHER user (not me)
      // - and this conversation is NOT currently open
      const isFromMe = Number(data.message.senderId) === Number(myId);
      const isOpen = Number(data.conversationId) === Number(selectedIdRef.current);
      if (!isFromMe && !isOpen) {
        setUnreadCounts((prev) => ({
          ...prev,
          [data.conversationId]: (prev[data.conversationId] ?? 0) + 1,
        }));
      }
    };

    socket.on("receive_message", onReceiveMessage);
    return () => {
      socket.off("connect", onConnect);
      socket.off("receive_message", onReceiveMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.userId, currentUser?.id]);

  // ─── Status Update Socket ───────────────────────────────────────────────────
  useEffect(() => {
    const onStatusUpdate = (data: { userId: number; isOnline: boolean; lastActiveAt?: string }) => {
      setUserStatuses((prev) => ({
        ...prev,
        [data.userId]: { isOnline: data.isOnline, lastActiveAt: data.lastActiveAt || null },
      }));
    };
    socket.on("user_status_update", onStatusUpdate);
    return () => {
      socket.off("user_status_update", onStatusUpdate);
    };
  }, []);

  // When user opens a conversation → reset its unread count immediately
  const handleSelectConversation = (id: number) => {
    setUnreadCounts((prev) => ({ ...prev, [id]: 0 }));
    onSelectConversation(id);
  };

  const filtered = searchQuery
    ? conversations.filter((c) => {
      const id = currentUser?.userId || currentUser?.id;
      const other = Number(id) === Number(c.buyerId) ? c.seller : c.buyer;
      return other?.fullName?.toLowerCase().includes(searchQuery.toLowerCase());
    })
    : conversations;

  const handleAvatarError = (e: any) => {
    e.target.src = DEFAULT_AVATAR;
  };

  const ConversationItem = ({ chat }: { chat: Conversation }) => {
    const id = currentUser?.userId || currentUser?.id;
    const isBuyer = Number(id) === Number(chat.buyerId);
    const otherUser = isBuyer ? chat.seller : chat.buyer;
    const lastMsg = chat.messages?.[0];
    const time = lastMsg
      ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "";
    const isActive = chat.id === selectedConversationId;
    const unread = unreadCounts[chat.id] ?? 0;
    const hasUnread = unread > 0 && !isActive;

    const otherUserId = otherUser?.id;
    const status = otherUserId ? userStatuses[otherUserId] : null;
    const isOnline = status ? status.isOnline : (otherUser as any)?.isOnline;

    return (
      <div
        onClick={() => handleSelectConversation(chat.id)}
        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${isActive ? "bg-blue-50 border border-blue-100" : "hover:bg-gray-50"
          }`}
      >
        <div className="relative shrink-0">
          <img
            src={otherUser?.profilePicture || DEFAULT_AVATAR}
            alt={otherUser?.fullName || "User Avatar"}
            onError={handleAvatarError}
            className="w-12 h-12 rounded-full object-cover"
          />
          {isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center gap-2">
            <h4 className={`text-sm truncate ${isActive
                ? "font-bold text-blue-700"
                : hasUnread
                  ? "font-bold text-gray-900"
                  : "font-semibold text-gray-900"
              }`}>
              {otherUser?.fullName || "Unknown User"}
            </h4>
            <div className="flex items-center gap-1.5 shrink-0">
              {time && (
                <span className={`text-[10px] ${hasUnread ? "text-blue-500 font-semibold" : "text-gray-400"}`}>
                  {time}
                </span>
              )}
              {hasUnread && (
                <span className="bg-blue-600 text-white text-[10px] font-bold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </div>
          </div>
          <p className={`text-xs truncate mt-0.5 ${hasUnread ? "text-gray-800 font-medium" : "text-gray-500"}`}>
            {lastMsg?.isVoice ? "🎤 Voice message" : lastMsg?.text || "Image "}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col h-[90vh]">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900">Messages</h2>
        <button className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button className="p-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50">
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto -mx-1 px-1">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 px-1">
          All Conversations
        </p>
        <div className="space-y-1">
          {loading ? (
            <div className="space-y-2 py-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length > 0 ? (
            filtered.map((chat) => <ConversationItem key={chat.id} chat={chat} />)
          ) : (
            <div className="text-center py-16">
              <p className="text-3xl mb-3">💬</p>
              <p className="text-sm font-medium text-gray-500">No conversations yet</p>
              <p className="text-xs text-gray-400 mt-1">Browse properties and message a seller</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesSidebar;