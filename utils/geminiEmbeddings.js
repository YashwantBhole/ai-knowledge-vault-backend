const axios = require('axios');
require("dotenv").config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const EMBEDDING_MODEL = 'gemini-embedding-001';

async function getEmbedding(text) {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set");
    }
    if (!text) return [];

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent`;

    const body = {
        model: `models/${EMBEDDING_MODEL}`,
        content: {
            parts: [{ text }],
        },
        task_type: "RETRIEVAL_DOCUMENT"
    };

    const headers = {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
    };

    const res = await axios.post(url, body, { headers, timeout: 60000 });

    const embeddingValues = res.data?.embedding?.values;

    if (!embeddingValues || !Array.isArray(embeddingValues)) {
        console.error("Unexpected embedding response", res.data);
        throw new Error("failed to get embedding from Gemini");
    }

    return embeddingValues;

}

module.exports = { getEmbedding }