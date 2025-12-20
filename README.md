# 🧠 AI Knowledge Vault – Backend (Node.js + Express + RAG)

Backend for the **AI Knowledge Vault**, a powerful RAG system that transforms documents into searchable, intelligent answers.

---

## 🚀 Features
- 🔐 JWT Authentication  
- 📁 File Uploads (Backblaze/S3)  
- ✂ Text Extraction  
- 📦 Chunk Generation  
- 🧩 Embedding Creation  
- 🔎 Vector Search  
- 🤖 RAG-Based AI Answering  
- 🗃 MongoDB Atlas storage  
- ☁ Deployed on **Render**

---

## 🧱 Tech Stack
- Node.js
- Express
- MongoDB Atlas
- Vector Embeddings (Gemini/OpenAI/local)
- B2/S3 File Storage
- JWT Auth

---

## 🔐 Environment Variables (`.env`)
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
B2_KEY_ID=your_backblaze_key
B2_APPLICATION_KEY=your_backblaze_secret
B2_BUCKET=your_bucket
AI_API_KEY=your_gemini_or_openai_key
```