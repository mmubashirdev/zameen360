import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { streamChatMessage, clearChatSession } from "@/api/chatbot.api";
import {
  X,
  Send,
  Bot,
  CheckCheck,
  Trash2,
  Loader2,
  Home,
  MapPin,
  Ruler,
  TrendingUp,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: number;
  type: "bot" | "user";
  content: string;
  time: string;
  read?: boolean;
  isStreaming?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const CHATBOT_Z_INDEX = 100000;
const SESSION_ID = crypto.randomUUID();

const WELCOME: Message = {
  id: 1,
  type: "bot",
  time: new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  }),
  content:
    "Hi there! 👋 Welcome to **Zameen360**!\n\nI'm your personal real estate assistant. I can help you with:\n- Finding plots, houses & apartments\n- Price ranges across DHA, Bahria Town & more\n- Buying, selling & renting guidance\n- Society comparisons & investment tips\n\nWhat are you looking for today? 🏠",
};

const QUICK_REPLIES = [
  { label: "5 Marla plots in DHA Lahore", icon: <Home size={12} /> },
  { label: "Rent a house in Bahria Town", icon: <MapPin size={12} /> },
  { label: "1 Kanal house price in Islamabad", icon: <Ruler size={12} /> },
  { label: "Best society to invest in 2025", icon: <TrendingUp size={12} /> },
];

// ─── Markdown Renderer ───────────────────────────────────────────────────────
const renderMarkdown = (text: string) => {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key} className="my-1 space-y-0.5 pl-1">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, i) => {
    if (line.startsWith("- ") || line.startsWith("• ")) {
      listItems.push(
        <li key={i} className="flex items-start gap-1.5">
          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
          <span>{formatInline(line.slice(2))}</span>
        </li>
      );
    } else {
      flushList(`list-${i}`);
      if (line.trim() === "") {
        elements.push(<div key={i} className="h-1" />);
      } else {
        elements.push(<p key={i}>{formatInline(line)}</p>);
      }
    }
  });

  flushList("list-end");
  return elements;
};

const formatInline = (text: string): React.ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong key={i} className="font-semibold text-slate-800">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("*") && part.endsWith("*"))
      return (
        <em key={i} className="italic">
          {part.slice(1, -1)}
        </em>
      );
    return <span key={i}>{part}</span>;
  });
};

// ─── Typing Dots ─────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div className="flex justify-start">
    <div className="rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-2 w-2 rounded-full bg-blue-300"
            style={{
              animation: "typingBounce 1.2s infinite ease-in-out",
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

// ─── ChatBot Component ───────────────────────────────────────────────────────
const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Scroll to bottom ────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Focus input on open ─────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // ── Send message to backend ─────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const now = () =>
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      // Add user message
      const userMsg: Message = {
        id: Date.now(),
        type: "user",
        content: text.trim(),
        time: now(),
        read: true,
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);
      setIsStreaming(true);

      // Cancel previous request
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      try {
        const response = await streamChatMessage(
          {
            message: text.trim(),
            sessionId: SESSION_ID,
          },
          abortRef.current?.signal
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        // Create bot placeholder
        const botId = Date.now() + 1;
        const botMsg: Message = {
          id: botId,
          type: "bot",
          content: "",
          time: now(),
          isStreaming: true,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);

        // Read SSE stream
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;

            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "chunk" && data.chunk) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botId
                      ? { ...m, content: m.content + data.chunk }
                      : m
                  )
                );
              }

              if (data.type === "error") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botId
                      ? { ...m, content: data.message, isStreaming: false }
                      : m
                  )
                );
                setIsStreaming(false);
                return;
              }

              if (data.type === "done") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === botId ? { ...m, isStreaming: false } : m
                  )
                );
                setIsStreaming(false);
                if (!isOpen) setUnreadCount((c) => c + 1);
              }
            } catch {
              // Skip malformed lines
            }
          }
        }
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setIsTyping(false);
        setIsStreaming(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            type: "bot",
            content:
              "⚠️ Unable to connect to the server. Please check your connection and try again.",
            time: now(),
          },
        ]);
      }
    },
    [isStreaming, isOpen]
  );

  // ── Clear chat ──────────────────────────────────────────────────────────
  const clearChat = async () => {
    abortRef.current?.abort();
    setIsStreaming(false);
    setIsTyping(false);

    try {
      await clearChatSession(SESSION_ID);
    } catch {
      // Ignore network errors on clear
    }

    setMessages([{ ...WELCOME, id: Date.now() }]);
    setUnreadCount(0);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ── Last message state ──────────────────────────────────────────────────
  const lastMsg = messages[messages.length - 1];
  const showQuickReplies =
    lastMsg?.type === "bot" && !lastMsg?.isStreaming && !isTyping;

  // ─── Render ────────────────────────────────────────────────────────────
  const chatBot = (
    <>
      {/* ── Floating Button ──────────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{ zIndex: CHATBOT_Z_INDEX }}
          className="fixed bottom-6 right-20 flex h-14 w-14 items-center
                     justify-center rounded-full bg-blue-600 text-white
                     shadow-xl shadow-blue-600/40 transition-all duration-200
                     hover:scale-110 hover:bg-blue-700 active:scale-95"
        >
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
            <Bot size={22} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-blue-600 bg-emerald-400" />
          </div>
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 animate-pulse items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* ── Chat Window ──────────────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{ zIndex: CHATBOT_Z_INDEX }}
          className="fixed bottom-6 right-6 flex h-[610px] w-[390px] flex-col
                     overflow-hidden rounded-2xl border border-slate-200/80
                     bg-white shadow-2xl shadow-slate-900/20"
        >
          {/* ── Header ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20">
                <Bot size={21} />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-blue-600 bg-emerald-400" />
              </div>
              <div>
                <p className="text-[14.5px] font-bold leading-tight">
                  Zameen360 Assistant
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-white/75">
                  {isStreaming || isTyping ? (
                    <>
                      <Loader2 size={9} className="animate-spin" />
                      Typing...
                    </>
                  ) : (
                    <>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      Online · Real Estate AI
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                onClick={clearChat}
                title="Clear conversation"
                className="flex h-8 w-8 items-center justify-center rounded-lg
                           text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                <Trash2 size={15} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg
                           text-white/80 transition hover:bg-white/15 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* ── Messages ───────────────────────────────────────────── */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-4 py-4 scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Bot avatar */}
                {msg.type === "bot" && (
                  <div className="mr-2 mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
                    <Bot size={12} />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] shadow-sm ${
                    msg.type === "user"
                      ? "rounded-br-sm bg-blue-600 text-white"
                      : "rounded-bl-sm bg-white text-slate-700"
                  }`}
                >
                  {/* Content */}
                  <div className="space-y-0.5 leading-relaxed">
                    {msg.content ? (
                      renderMarkdown(msg.content)
                    ) : msg.isStreaming ? (
                      <span className="inline-block h-4 w-1.5 animate-pulse rounded-sm bg-slate-300" />
                    ) : null}
                  </div>

                  {/* Footer */}
                  <div
                    className={`mt-1.5 flex items-center gap-1 text-[10px] ${
                      msg.type === "user"
                        ? "justify-end text-blue-100"
                        : "text-slate-400"
                    }`}
                  >
                    {msg.isStreaming && (
                      <Loader2 size={9} className="animate-spin" />
                    )}
                    <span>{msg.time}</span>
                    {msg.type === "user" && msg.read && (
                      <CheckCheck size={11} className="text-blue-200" />
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {isTyping && <TypingDots />}

            {/* Quick replies */}
            {showQuickReplies && (
              <div className="grid grid-cols-2 gap-2 pt-1">
                {QUICK_REPLIES.map((qr, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(qr.label)}
                    disabled={isStreaming}
                    className="flex items-center gap-1.5 rounded-xl border
                               border-slate-200 bg-white px-2.5 py-2 text-left
                               text-[11.5px] font-medium text-slate-600 shadow-sm
                               transition hover:border-blue-300 hover:bg-blue-50
                               hover:text-blue-700 disabled:opacity-50"
                  >
                    <span className="shrink-0 text-blue-500">{qr.icon}</span>
                    {qr.label}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ──────────────────────────────────────────────── */}
          <div className="border-t border-slate-100 bg-white px-3 py-3">
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-2.5 transition ${
                isStreaming
                  ? "border-slate-200 bg-slate-50"
                  : "border-slate-200 bg-white focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50"
              }`}
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && sendMessage(input)
                }
                placeholder={
                  isStreaming ? "Please wait..." : "Ask about properties..."
                }
                disabled={isStreaming}
                className="flex-1 bg-transparent text-[13px] text-slate-700
                           placeholder:text-slate-400 focus:outline-none
                           disabled:cursor-not-allowed disabled:opacity-60"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isStreaming}
                className="flex h-7 w-7 shrink-0 items-center justify-center
                           rounded-full bg-blue-600 text-white transition
                           hover:bg-blue-700 disabled:cursor-not-allowed
                           disabled:opacity-40"
              >
                {isStreaming ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <Send size={13} />
                )}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              Zameen360 AI · Powered by Gemini · Real Estate Only
            </p>
          </div>
        </div>
      )}

      {/* Keyframe for typing dots */}
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0px); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
    </>
  );

  return createPortal(chatBot, document.body);
};

export default ChatBot;