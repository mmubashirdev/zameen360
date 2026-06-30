const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

if (!process.env.GEMINI_API_KEY) {
  console.error("❌  GEMINI_API_KEY is missing from .env file");
  process.exit(1);
}

const geminiClient = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const GEMINI_MODEL = "gemini-2.5-flash";

module.exports = { geminiClient, GEMINI_MODEL };