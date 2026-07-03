const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

if (!process.env.GEMINI_API_KEY) {
  console.warn(
    "GEMINI_API_KEY is missing; chatbot features will be unavailable.",
  );
}

const geminiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    })
  : null;

const GEMINI_MODEL = "gemini-2.5-flash";

module.exports = { geminiClient, GEMINI_MODEL };
