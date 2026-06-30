const {
  streamGeminiResponse,
  clearSessionHistory,
  getSessionHistory,
} = require("../services/gemini.service");

// ─── SSE Helpers ───────────────────────────────────────────────────────────

/**
 * Sets required headers for a Server-Sent Events response.
 * @param {import("express").Response} res
 */
const setSSEHeaders = (res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();
};

/**
 * Writes a single SSE event to the response.
 * @param {import("express").Response} res
 * @param {object} data
 */
const writeSSE = (res, data) => {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

// ─── POST /api/chat/message ────────────────────────────────────────────────

/**
 * Accepts a user message and streams Gemini AI response via SSE.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const sendMessage = async (req, res) => {
  const { message, sessionId } = req.body;

  // ── Validate message ───────────────────────────────────────────────────
  if (!message || typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      success: false,
      error: "message is required and must be a non-empty string.",
    });
  }

  // ── Validate sessionId ─────────────────────────────────────────────────
  if (!sessionId || typeof sessionId !== "string" || !sessionId.trim()) {
    return res.status(400).json({
      success: false,
      error: "sessionId is required and must be a non-empty string.",
    });
  }

  // ── Validate message length ────────────────────────────────────────────
  if (message.trim().length > 1000) {
    return res.status(400).json({
      success: false,
      error: "Message exceeds the 1000 character limit.",
    });
  }

  // ── Open SSE connection ────────────────────────────────────────────────
  setSSEHeaders(res);

  // ── Stream Gemini response ─────────────────────────────────────────────
  await streamGeminiResponse(sessionId, message.trim(), {
    onChunk: (chunk) => writeSSE(res, { type: "chunk", chunk }),
    onDone: () => {
      writeSSE(res, { type: "done" });
      res.end();
    },
    onError: (errorMessage) => {
      writeSSE(res, { type: "error", message: errorMessage });
      res.end();
    },
  });
};

// ─── DELETE /api/chat/session/:sessionId ───────────────────────────────────

/**
 * Clears the conversation history for a given session ID.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const deleteSession = (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId || !sessionId.trim()) {
    return res.status(400).json({
      success: false,
      error: "sessionId param is required.",
    });
  }

  const deleted = clearSessionHistory(sessionId);

  return res.status(200).json({
    success: true,
    message: deleted
      ? "Session cleared successfully."
      : "No active session found — nothing to clear.",
  });
};

// ─── GET /api/chat/history/:sessionId ─────────────────────────────────────

/**
 * Returns the full conversation history for a given session ID.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const getChatHistory = (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId || !sessionId.trim()) {
    return res.status(400).json({
      success: false,
      error: "sessionId param is required.",
    });
  }

  const history = getSessionHistory(sessionId);

  return res.status(200).json({
    success: true,
    sessionId,
    totalMessages: history.length,
    history: history.map((turn) => ({
      role: turn.role,
      text: turn.parts[0].text,
    })),
  });
};

// ─── GET /api/chat/health ──────────────────────────────────────────────────

/**
 * Health check — confirms the chat service is running.
 * @param {import("express").Request} _req
 * @param {import("express").Response} res
 */
const healthCheck = (_req, res) => {
  return res.status(200).json({
    success: true,
    service: "Zameen360 Chat API",
    status: "online",
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  sendMessage,
  deleteSession,
  getChatHistory,
  healthCheck,
};