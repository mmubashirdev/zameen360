// src/features/marketplace/components/hooks/useSocket.ts
import { useEffect, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

// ─── Singleton socket instance ────────────────────────────────────────────────
let socketInstance: Socket | null = null;

const getSocket = (): Socket => {
  if (!socketInstance || !socketInstance.connected) {
    socketInstance = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
  }
  return socketInstance;
};

// ─── Proper Type Definitions ──────────────────────────────────────────────────
export interface PropertyEventData {
  message?: string;
  property?: {
    id: number;
    title: string | null;
    city: string | null;
    locality: string | null;
    price: string | null;
    bedrooms: string | null;
    bathrooms: string | null;
    areaSize: string | null;
    areaUnit: string | null;
    purpose: string | null;
    propertyType: string | null;
    amenities: string[];
    images: string[];
    status: string;
    userId?: number;
  };
  propertyId?: number;
  status?: string;
  reason?: string;
  timestamp?: string;
}

type SocketCallback = (data: PropertyEventData) => void;

interface UseSocketOptions {
  userId?: number | string | null;
  isAdmin?: boolean;
  joinPublic?: boolean;
}

export const useSocket = ({
  userId,
  isAdmin = false,
  joinPublic = false,
}: UseSocketOptions = {}) => {
  // ─── Store socket in ref (not state, doesn't trigger re-render) ───────────
  const socketRef = useRef<Socket | null>(null);

  // ─── Initialize socket once on mount ──────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const handleConnect = () => {
      console.log("🔌 Socket connected:", socket.id);
      if (userId) socket.emit("join_user_room", userId);
      if (isAdmin) socket.emit("join_admin_room");
      if (joinPublic) socket.emit("join_public");
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
    };

    const handleError = (err: Error) => {
      console.warn("Socket connection error:", err.message);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("connect_error", handleError);

    // Already connected? Join rooms immediately
    if (socket.connected) {
      if (userId) socket.emit("join_user_room", userId);
      if (isAdmin) socket.emit("join_admin_room");
      if (joinPublic) socket.emit("join_public");
    }

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleError);
    };
  }, [userId, isAdmin, joinPublic]);

  // ─── Helper: add listener — returns cleanup fn ────────────────────────────
  const on = useCallback((event: string, callback: SocketCallback) => {
    const socket = socketRef.current;
    if (!socket) return () => {};

    socket.on(event, callback);
    return () => {
      socket.off(event, callback);
    };
  }, []);

  // ─── Helper: remove listener ──────────────────────────────────────────────
  const off = useCallback((event: string, callback?: SocketCallback) => {
    const socket = socketRef.current;
    if (!socket) return;
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  }, []);

  // ─── Helper: emit event ───────────────────────────────────────────────────
  const emit = useCallback((event: string, data?: unknown) => {
    const socket = socketRef.current;
    if (socket?.connected) {
      socket.emit(event, data);
    }
  }, []);

  // ✅ FIX: Return functions only, no ref.current access
  return { on, off, emit };
};