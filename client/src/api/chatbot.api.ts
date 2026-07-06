import {
  CHAT_API_BASE_URL,
  NGROK_SKIP_BROWSER_WARNING_HEADER,
} from "@shared/config/api";

const CHAT_BASE_URL = CHAT_API_BASE_URL;

export interface ChatStreamPayload {
  message: string;
  sessionId: string;
}

export const streamChatMessage = async (
  { message, sessionId }: ChatStreamPayload,
  signal?: AbortSignal,
) => {
  return fetch(`${CHAT_BASE_URL}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...NGROK_SKIP_BROWSER_WARNING_HEADER,
    },
    body: JSON.stringify({ message, sessionId }),
    signal,
  });
};

export const clearChatSession = async (sessionId: string) => {
  return fetch(`${CHAT_BASE_URL}/session/${sessionId}`, {
    method: "DELETE",
    headers: NGROK_SKIP_BROWSER_WARNING_HEADER,
  });
};

export const getChatHealth = async () => {
  const response = await fetch(`${CHAT_BASE_URL}/health`, {
    headers: NGROK_SKIP_BROWSER_WARNING_HEADER,
  });
  return response.json();
};
