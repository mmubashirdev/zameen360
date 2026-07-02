const CHAT_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000") + "/api/chat";

export interface ChatStreamPayload {
  message: string;
  sessionId: string;
}

export const streamChatMessage = async ({ message, sessionId }: ChatStreamPayload, signal?: AbortSignal) => {
  return fetch(`${CHAT_BASE_URL}/message`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
    signal,
  });
};

export const clearChatSession = async (sessionId: string) => {
  return fetch(`${CHAT_BASE_URL}/session/${sessionId}`, {
    method: "DELETE",
  });
};

export const getChatHealth = async () => {
  const response = await fetch(`${CHAT_BASE_URL}/health`);
  return response.json();
};
