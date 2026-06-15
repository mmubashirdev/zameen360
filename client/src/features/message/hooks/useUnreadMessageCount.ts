import { useState, useEffect, useCallback } from "react";
import axiosInstance from "@shared/lib/axios";
import socket from "@shared/lib/socket";
import { useAuthContext } from "@features/auth/hooks/useAuth";

/**
 * Returns the total number of unread messages for the logged-in user
 * across ALL conversations. Updates in real-time via socket events.
 */
export function useUnreadMessageCount(): number {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user: currentUser } = useAuthContext();

  const fetchCount = useCallback(async () => {
    try {
      const result: any = await axiosInstance.get("/messages/unread-count");
      if (result.success) {
        setUnreadCount(result.data.count ?? 0);
      }
    } catch {
      // Silently fail — sidebar badge is non-critical
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    if (!currentUser) return;
    fetchCount();
  }, [currentUser, fetchCount]);

  // Re-fetch when a new message arrives via socket
  useEffect(() => {
    const userId = currentUser?.userId || currentUser?.id;
    if (!userId) return;

    const onReceiveMessage = () => {
      // Slight delay to allow the server to persist before we query
      setTimeout(fetchCount, 300);
    };

    socket.on("receive_message", onReceiveMessage);
    return () => {
      socket.off("receive_message", onReceiveMessage);
    };
  }, [currentUser?.userId, currentUser?.id, fetchCount]);

  return unreadCount;
}
