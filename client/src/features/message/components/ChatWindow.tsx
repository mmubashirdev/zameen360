import { useState, useEffect, useRef, useCallback } from "react";
import {
  Phone, Video, Info, MoreVertical, Smile, Paperclip,
  Camera, Mic, Play, CheckCheck, Send, X, ChevronLeft, ChevronRight, Loader2,
} from "lucide-react";
import axiosInstance from "@shared/lib/axios";
import socket from "@shared/lib/socket";
import { useAuthContext } from "@features/auth/hooks/useAuth";
import { formatLastActive } from "@shared/utils/helpers";

export interface Message {
  id: number;
  text?: string;
  createdAt: string;
  isSender: boolean;
  avatar?: string;
  isVoice?: boolean;
  voiceDuration?: string;
  senderId: number;
  mediaUrl?: string;
  mediaType?: string;
  sender?: { id: number; fullName: string; profilePicture?: string; lastActiveAt?: string };
}

interface ChatWindowProps {
  conversationId: number | null;
  newConversationContext?: {
    sellerId: number;
    propertyId: number;
    sellerName?: string;
    sellerAvatar?: string;
  } | null;
  onConversationCreated?: (id: number) => void;
}

interface ImageItem {
  file: File;
  localUrl: string;
}

const DEFAULT_AVATAR =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ChatWindow: React.FC<ChatWindowProps> = ({ conversationId, newConversationContext, onConversationCreated }) => {
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [selectedImages, setSelectedImages] = useState<ImageItem[]>([]);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [imageError, setImageError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef<number | null>(conversationId);
  const previousConversationId = useRef<number | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [userStatuses, setUserStatuses] = useState<Record<number, { isOnline: boolean; lastActiveAt: string | null }>>({});

  const { user: currentUser } = useAuthContext();

  const scrollToBottom = useCallback(() => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }, []);

  const handleAvatarError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = DEFAULT_AVATAR;
  };

  const formatTime = (date: string) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => { conversationIdRef.current = conversationId; }, [conversationId]);

  // ─── Socket ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!(currentUser?.userId || currentUser?.id)) return;

    const onConnect = () => {
      const id = currentUser?.userId || currentUser?.id;
      socket.emit("join_user_room", Number(id));
    };

    const onReceiveMessage = (data: { message: any; conversationId: number }) => {
      if (Number(data.conversationId) !== Number(conversationIdRef.current)) return;
      const myId = currentUser?.userId || currentUser?.id;
      if (Number(data.message.senderId) === Number(myId)) return;

      setMessages((prev) => {
        if (prev.find((m) => Number(m.id) === Number(data.message.id))) return prev;
        return [...prev, { ...data.message, isSender: false, avatar: data.message.sender?.profilePicture || DEFAULT_AVATAR }];
      });
      scrollToBottom();
    };

    socket.on("connect", onConnect);
    socket.on("receive_message", onReceiveMessage);

    if (!socket.connected) {
      socket.connect();
    } else {
      const id = currentUser?.userId || currentUser?.id;
      socket.emit("join_user_room", Number(id));
    }

    socket.on("connect_error", (err: Error) => console.error("Socket error:", err.message));

    const onStatusUpdate = (data: { userId: number; isOnline: boolean; lastActiveAt?: string }) => {
      setUserStatuses((prev) => ({
        ...prev,
        [data.userId]: { isOnline: data.isOnline, lastActiveAt: data.lastActiveAt || null },
      }));
    };
    socket.on("user_status_update", onStatusUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("receive_message", onReceiveMessage);
      socket.off("connect_error");
      socket.off("user_status_update", onStatusUpdate);
    };
  }, [currentUser?.userId, currentUser?.id, scrollToBottom]);

  // ─── Fetch messages ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (conversationId && conversationId !== previousConversationId.current) {
      if (previousConversationId.current !== null || messages.length === 0) {
        fetchMessages(conversationId);
      }
    }
    if (!conversationId) setMessages([]);
    previousConversationId.current = conversationId;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const fetchMessages = async (convId: number) => {
    setLoading(true);
    try {
      const result: any = await axiosInstance.get(`/messages/${convId}`);
      if (result.success) {
        setMessages(
          result.data.map((msg: any) => ({
            ...msg,
            isSender: Number(msg.senderId) === Number(currentUser?.userId || currentUser?.id),
            avatar: msg.sender?.profilePicture || DEFAULT_AVATAR,
          }))
        );
        scrollToBottom();
        window.dispatchEvent(new CustomEvent("messages_marked_read"));
      }
    } catch (err) {
      console.error("fetchMessages error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Image picker ─────────────────────────────────────────────────────────────
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;

    setImageError(null);
    const oversized = files.find((f) => f.size > MAX_IMAGE_SIZE);
    if (oversized) {
      setImageError(`"${oversized.name}" exceeds 5 MB. Please choose smaller images.`);
      return;
    }

    const items: ImageItem[] = files.map((f) => ({ file: f, localUrl: URL.createObjectURL(f) }));
    setSelectedImages(items);
    setPreviewIndex(0);
  };

  const removeImage = (idx: number) => {
    URL.revokeObjectURL(selectedImages[idx].localUrl);
    const next = selectedImages.filter((_, i) => i !== idx);
    setSelectedImages(next);
    setPreviewIndex(Math.min(previewIndex, next.length - 1));
  };

  const cancelImages = () => {
    selectedImages.forEach((img) => URL.revokeObjectURL(img.localUrl));
    setSelectedImages([]);
    setImageError(null);
  };

  // ─── Send images ──────────────────────────────────────────────────────────────
  const handleSendImages = async () => {
    if (!selectedImages.length) return;
    if (!conversationId && !newConversationContext) return;

    setSending(true);
    setImageError(null);

    const toSend = [...selectedImages];
    cancelImages();

    let firstConvId: number | null = conversationId;

    for (let i = 0; i < toSend.length; i++) {
      const img = toSend[i];
      const tempId = -(Date.now() + i);

      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          mediaUrl: img.localUrl,
          mediaType: "image",
          createdAt: new Date().toISOString(),
          isSender: true,
          senderId: Number(currentUser?.userId || currentUser?.id),
          avatar: currentUser?.profilePicture || DEFAULT_AVATAR,
        },
      ]);
      scrollToBottom();

      try {
        const formData = new FormData();
        formData.append("media", img.file);
        const uploadResult: any = await axiosInstance.post("/messages/upload-media", formData);

        if (!uploadResult.success) throw new Error(uploadResult.message || "Upload failed");

        const { mediaUrl, mediaType } = uploadResult.data;

        const payload: any = { mediaUrl, mediaType, text: "" };
        if (firstConvId) {
          payload.conversationId = firstConvId;
        } else if (newConversationContext) {
          payload.receiverId = newConversationContext.sellerId;
          payload.propertyId = newConversationContext.propertyId;
        }

        const result: any = await axiosInstance.post("/messages", payload);

        if (result.success) {
          const newMsg = result.data.message;
          const retConvId = result.data.conversationId;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === tempId
                ? { ...newMsg, isSender: true, avatar: currentUser?.profilePicture || DEFAULT_AVATAR }
                : m
            )
          );

          if (!firstConvId && retConvId) {
            firstConvId = retConvId;
            conversationIdRef.current = retConvId;
            onConversationCreated?.(retConvId);
          }
        } else {
          setMessages((prev) => prev.filter((m) => m.id !== tempId));
        }
      } catch (err: any) {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setImageError("One or more images failed to send.");
      }
    }

    setSending(false);
  };

  // ─── Send text ────────────────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    if (!conversationId && !newConversationContext) return;

    const textToSend = messageInput.trim();
    const tempId = -Date.now();

    setMessages((prev) => [
      ...prev,
      {
        id: tempId,
        text: textToSend,
        createdAt: new Date().toISOString(),
        isSender: true,
        senderId: Number(currentUser?.userId || currentUser?.id),
        avatar: currentUser?.profilePicture || DEFAULT_AVATAR,
      },
    ]);
    setMessageInput("");
    scrollToBottom();

    try {
      const payload: any = { text: textToSend };
      if (conversationId) {
        payload.conversationId = conversationId;
      } else if (newConversationContext) {
        payload.receiverId = newConversationContext.sellerId;
        payload.propertyId = newConversationContext.propertyId;
      }

      const result: any = await axiosInstance.post("/messages", payload);

      if (result.success) {
        const newMessage = result.data.message;
        const returnedConversationId = result.data.conversationId;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempId
              ? { ...newMessage, isSender: true, avatar: currentUser?.profilePicture || DEFAULT_AVATAR }
              : msg
          )
        );
        if (!conversationId && returnedConversationId) {
          conversationIdRef.current = returnedConversationId;
          onConversationCreated?.(returnedConversationId);
        }
      } else {
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
      }
    } catch (err) {
      console.error("sendMessage error:", err);
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  // ─── Empty state ─────────────────────────────────────────────────────────────
  if (!conversationId && !newConversationContext) {
    return (
      <div className="bg-white border border-gray-200 rounded-4xl flex flex-col h-[88vh] w-232.5 items-center justify-center gap-3">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
          <Send className="w-7 h-7 text-blue-400" />
        </div>
        <p className="text-gray-500 font-medium">Select a conversation</p>
        <p className="text-gray-400 text-sm">Choose from the list to start messaging</p>
      </div>
    );
  }

  const otherUserMsg = messages.find((m) => !m.isSender);
  const chatName = otherUserMsg?.sender?.fullName || newConversationContext?.sellerName || "New Conversation";
  const chatAvatar = otherUserMsg?.avatar || newConversationContext?.sellerAvatar || DEFAULT_AVATAR;

  const otherUserId = otherUserMsg?.sender?.id || newConversationContext?.sellerId;
  const status = otherUserId ? userStatuses[otherUserId] : null;
  const isOnline = status ? status.isOnline : (otherUserMsg?.sender as any)?.isOnline || false;
  const lastActiveAt = status?.lastActiveAt || otherUserMsg?.sender?.lastActiveAt || null;

  return (
    <>
      {/* ── Main Chat Container ─────────────────────────────────────────────── */}
      <div className="bg-white border border-gray-200 rounded-4xl flex flex-col h-[90vh] w-232.5 overflow-hidden">

        {/* ── Header ─────────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={chatAvatar}
                alt={chatName}
                onError={handleAvatarError}
                className="w-11 h-11 rounded-full object-cover"
              />
              {isOnline && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{chatName}</h3>
              <p className={`text-xs font-medium ${isOnline ? "text-green-500" : "text-gray-400"}`}>
                {isOnline ? "Online" : formatLastActive(lastActiveAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Video className="w-4 h-4" />
            </button>
            <button className="p-2.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
              <Info className="w-4 h-4" />
            </button>
            <button className="p-2.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Messages ───────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5 bg-white min-h-0">
          <div className="text-center mb-2">
            <span className="text-xs text-gray-400 font-medium">Today</span>
          </div>

          {loading && messages.length === 0 ? (
            <div className="space-y-4 py-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className={`flex gap-2 ${i % 2 === 0 ? "justify-start" : "justify-end"}`}>
                  {i % 2 === 0 && (
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse shrink-0" />
                  )}
                  <div className={`h-12 bg-gray-200 rounded-2xl animate-pulse ${i % 2 === 0 ? "w-64" : "w-56"}`} />
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center py-16">
              <p className="text-3xl">👋</p>
              <p className="text-gray-500 font-medium">No messages yet</p>
              <p className="text-gray-400 text-sm">Send a message to start the conversation</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 items-end ${msg.isSender ? "justify-end" : "justify-start"}`}
              >
                {/* Other user avatar */}
                {!msg.isSender && (
                  <div className="relative shrink-0">
                    <img
                      src={msg.avatar || DEFAULT_AVATAR}
                      alt="avatar"
                      onError={handleAvatarError}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                )}

                <div className={`max-w-[65%] flex flex-col ${msg.isSender ? "items-end" : "items-start"}`}>

                  {/* ── Image bubble ── */}
                  {msg.mediaType === "image" && msg.mediaUrl ? (
                    <>
                      <div
                        className={`rounded-2xl overflow-hidden cursor-pointer border transition-opacity hover:opacity-90 ${
                          msg.isSender ? "border-blue-200" : "border-gray-100"
                        }`}
                        onClick={() => setLightboxUrl(msg.mediaUrl!)}
                      >
                        <img
                          src={msg.mediaUrl}
                          className="max-w-65 max-h-70 w-full object-cover block"
                        />
                      </div>
                      <div className={`flex items-center gap-1 mt-1 px-1 ${msg.isSender ? "justify-end" : "justify-start"}`}>
                        <span className="text-[11px] text-gray-400">{formatTime(msg.createdAt)}</span>
                        {msg.isSender && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                    </>

                  ) : msg.isVoice ? (
                    /* ── Voice bubble ── */
                    <>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 flex items-center gap-3 min-w-60">
                        <button className="bg-white border border-blue-400 text-blue-500 p-2 rounded-full shrink-0 flex items-center justify-center">
                          <Play className="w-3.5 h-3.5 fill-blue-500" />
                        </button>
                        <div className="flex-1 flex items-center gap-0.5">
                          {[...Array(24)].map((_, i) => (
                            <div
                              key={i}
                              className="w-0.5 bg-blue-300 rounded-full"
                              style={{ height: `${Math.random() * 16 + 4}px` }}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{msg.voiceDuration || "0:15"}</span>
                      </div>
                      <span className="text-[11px] text-gray-400 mt-1 px-1">{formatTime(msg.createdAt)}</span>
                    </>

                  ) : (
                    /* ── Text bubble ── */
                    <>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          msg.isSender
                            ? "bg-blue-500 text-white rounded-br-sm"
                            : "bg-gray-50 border border-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">{msg.text}</p>
                      </div>
                      <div className={`flex items-center gap-1 mt-1 px-1 ${msg.isSender ? "justify-end" : "justify-start"}`}>
                        <span className="text-[11px] text-gray-400">{formatTime(msg.createdAt)}</span>
                        {msg.isSender && <CheckCheck className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                    </>
                  )}
                </div>

                {/* Sender avatar (optional — shown on right for sender) */}
                {msg.isSender && (
                  <div className="relative shrink-0">
                    <img
                      src={currentUser?.profilePicture || DEFAULT_AVATAR}
                      alt="you"
                      onError={handleAvatarError}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ── Error bar ──────────────────────────────────────────────────────── */}
        {imageError && (
          <div className="mx-4 mb-1 bg-red-50 border border-red-200 rounded-xl px-3 py-2 flex items-center justify-between gap-2 shrink-0">
            <p className="text-xs text-red-600 font-medium">{imageError}</p>
            <button onClick={() => setImageError(null)} className="text-red-400 hover:text-red-600 shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* ── Input bar ──────────────────────────────────────────────────────── */}
        <div className="px-4 py-4 border-t border-gray-100 shrink-0">
          {/* Hidden file input */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={handleImageFileChange}
          />

          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 gap-2 focus-within:border-blue-300 focus-within:bg-white transition-colors">
              <button className="text-gray-400 hover:text-gray-600 shrink-0">
                <Smile className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm placeholder-gray-400 focus:outline-none min-w-0"
              />

              <button className="text-gray-400 hover:text-gray-600 shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>

              {/* Camera → opens image picker */}
              <button
                onClick={() => imageInputRef.current?.click()}
                title="Send images (max 5 MB each)"
                className="text-gray-400 hover:text-blue-500 shrink-0 transition-colors relative"
              >
                <Camera className="w-5 h-5" />
                {sending && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />
                )}
              </button>
            </div>

            <button
              onClick={handleSendMessage}
              className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white p-3 rounded-full flex items-center justify-center transition-all shadow-sm shrink-0"
            >
              {messageInput.trim() ? <Send className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ═══ Image Preview Modal ═══════════════════════════════════════════════ */}
      {selectedImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col"
            style={{ maxHeight: "90vh" }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h3 className="font-bold text-gray-900">Send Images</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {selectedImages.length} image{selectedImages.length > 1 ? "s" : ""} selected
                </p>
              </div>
              <button
                onClick={cancelImages}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main preview */}
            <div
              className="relative flex-1 bg-gray-50 flex items-center justify-center overflow-hidden"
              style={{ minHeight: 280, maxHeight: 360 }}
            >
              <img
                src={selectedImages[previewIndex]?.localUrl}
                alt={`Preview ${previewIndex + 1}`}
                className="max-w-full max-h-85 object-contain rounded-xl"
              />

              {/* Prev / Next arrows */}
              {selectedImages.length > 1 && (
                <>
                  <button
                    onClick={() => setPreviewIndex((p) => Math.max(0, p - 1))}
                    disabled={previewIndex === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-700 disabled:opacity-30 transition"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPreviewIndex((p) => Math.min(selectedImages.length - 1, p + 1))}
                    disabled={previewIndex === selectedImages.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white rounded-full shadow-md text-gray-700 disabled:opacity-30 transition"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Index indicator */}
              {selectedImages.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 text-white text-xs px-2.5 py-1 rounded-full">
                  {previewIndex + 1} / {selectedImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail strip */}
            {selectedImages.length > 1 && (
              <div className="flex gap-2 px-5 py-3 overflow-x-auto border-t border-gray-100 bg-white shrink-0">
                {selectedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className={`relative shrink-0 w-14 h-14 rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                      idx === previewIndex
                        ? "border-blue-500 shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setPreviewIndex(idx)}
                  >
                    <img src={img.localUrl} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
                {/* Add more images */}
                <button
                  onClick={() => imageInputRef.current?.click()}
                  className="shrink-0 w-14 h-14 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Modal footer */}
            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between gap-3 bg-white shrink-0">
              <div className="text-xs text-gray-400">
                Each image must be under{" "}
                <span className="font-semibold text-gray-600">5 MB</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={cancelImages}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendImages}
                  disabled={sending}
                  className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
                >
                  {sending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending…</>
                  ) : (
                    <><Send className="w-4 h-4" /> Send {selectedImages.length > 1 ? `${selectedImages.length} images` : "image"}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Sent-image Lightbox ═══════════════════════════════════════════════ */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            onClick={() => setLightboxUrl(null)}
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightboxUrl}
            alt="Full size"
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};

export default ChatWindow;