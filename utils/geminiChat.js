const axios = require("axios");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const CHAT_MODEL = "gemma-3-27b-it";

async function generateAnswerFromDocs(question, contextChunks) {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  // join top chunks into one context block
  const contextText = contextChunks
    .map((c, idx) => `Chunk ${idx + 1}:\n${c}`)
    .join("\n\n---\n\n");

  const prompt = `
You are a helpful assistant for coding interview preparation.
Answer primarily using the DOCUMENT EXCERPTS below.
If the excerpts do not fully answer the question, clearly indicate which part is based on general knowledge.
Respond in a clean, structured format.

DOCUMENT EXCERPTS:
${contextText}

QUESTION:
${question}

Answer in a short, clear explanation.
  `.trim();

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent`;

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const headers = {
    "Content-Type": "application/json",
    "x-goog-api-key": GEMINI_API_KEY,
  };

  const res = await axios.post(url, body, { headers, timeout: 60000 });

  // Typical shape: candidates[0].content.parts[0].text
  const cand = res.data?.candidates?.[0];
  const parts = cand?.content?.parts || [];
  const textParts = parts
    .map((p) => p.text || "")
    .filter(Boolean);

  const answer = textParts.join("\n").trim();
  if (!answer) {
    throw new Error("No text in Gemini response");
  }

  return answer;
}

module.exports = { generateAnswerFromDocs };
