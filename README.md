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

                   ┌───────────────────────────┐
                   │       Frontend (React)     │
                   │  - Upload Docs             │
                   │  - Auth UI                 │
                   │  - Ask AI UI               │
                   └──────────────┬────────────┘
                                  │ API Calls
                                  ▼
                   ┌───────────────────────────┐
                   │     Backend (Express)      │
                   │  Auth / Upload / RAG Flow  │
                   │  Extract → Chunk → Embed   │
                   └──────────────┬────────────┘
                                  │
        ┌─────────────────────────┼──────────────────────────┐
        ▼                         ▼                          ▼
 ┌───────────────┐        ┌───────────────┐           ┌───────────────┐
 │   MongoDB      │        │  S3 / B2       │           │  AI Models     │
 │  (Metadata)    │        │  File Storage  │           │ (Gemini/OpenAI)│
 └───────────────┘        └───────────────┘           └───────────────┘

