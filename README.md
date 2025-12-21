<div align="center">

# 🧠 AI Knowledge Vault — Backend (Node.js + Express)

A **production-grade backend** powering the AI Knowledge Vault — a Hybrid Retrieval-Augmented Generation (RAG) system that converts uploaded documents into a semantic, searchable knowledge base with grounded AI answers.

<img src="../frontend/public/screenshots/ai-banner.png" width="100%" />

</div>

---

# 📌 Overview

This backend forms the core of the **AI Knowledge Vault**, managing:

- User authentication  
- File uploads (PDF, DOCX, TXT, images)  
- Text extraction (including OCR)  
- Chunk creation  
- Embedding generation  
- Vector search  
- Grounded AI responses using the RAG pipeline  

It is built using **Node.js, Express, MongoDB, and Google Gemini models** for embeddings & generation.

---

# 🚀 Key Features

### 🔐 Authentication & User Isolation
- Secure JWT Auth  
- Files & embeddings stored per user  
- Prevents cross-user data access  

### 📁 File Handling
- Upload PDFs, DOCX, TXT, PNG, JPG  
- Store in Backblaze B2 (S3 compatible)  
- Fetch downloadable file URLs  

### 📝 Text Extraction
- `pdf-parse` for PDFs  
- `mammoth` for DOCX  
- `tesseract.js` for OCR on images  

### ✂️ Chunking Engine
- Overlapping semantic chunks  
- Optimized for vector retrieval  
- Configurable chunk size  

### 🧠 Embedding Generation
- Uses **Gemini embeddings**  
- Stores vectors in MongoDB  
- Cosine similarity search  

### 🔍 Vector Search
- Compare embeddings  
- Retrieve top-k relevant chunks  

### 🤖 Ask-AI (RAG Pipeline)
- Fetch relevant chunks  
- Clean, structured prompting  
- Context-aware grounded answers  

---

# 🏗 Core Architecture

```
Client → Express API → Controllers → RAG Pipeline → Gemini → Response
```

### Flow Summary:

1. Upload → stored in B2  
2. Extract text  
3. Chunk text  
4. Generate embeddings  
5. Store vectors  
6. Ask AI → retrieve → generate answer  

---

# 🔐 Environment Variables

Create a `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

B2_KEY_ID=xxxx
B2_APPLICATION_KEY=xxxx
B2_BUCKET=your_bucket_name

AI_API_KEY=your_gemini_api_key
```

---

# 📡 API Endpoints

## Auth
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/signup` | Create new user |
| POST | `/api/login` | Authenticate user |

---

## File Operations
| Method | Endpoint | Description |
|--------|-----------|-------------|
| POST | `/api/upload` | Upload a document |
| GET  | `/api/files` | Get all files for user |
| GET  | `/api/files/:id` | Download file |
| DELETE | `/api/files/:id` | Delete file |

---

## RAG Processing

### 1️⃣ Extract Text  
```
POST /api/process-file/:id
```

### 2️⃣ Create Chunks  
```
POST /api/create-chunks/:id
```

### 3️⃣ Generate Embeddings  
```
POST /api/create-embeddings/:id
```

---

## Search & Ask AI

### 🔍 Semantic Search  
```
POST /api/search-docs
```

### 🤖 Ask AI  
```
POST /api/ask-docs
```

---

# 🛠 Run Locally

### Install
```bash
cd backend
npm install
```

### Start Dev Server
```bash
npm run dev
```

---

# 🌐 Deployment (Render)

### Settings:
- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Node Version:** 18+
- Add all `.env` keys in Render

---

# 🔮 Future Improvements

- Background job queue for embeddings  
- Multi-file RAG context  
- Embedding caching layer  
- Prompt templates per file type  
- Streaming responses  
- Improved OCR accuracy via preprocessing  

---

# 👤 Author & Connect

<div align="center">

### **Yashwant Bhole**

<br/>

<a href="https://github.com/YashwantBhole" target="_blank" style="margin: 0 10px;">
  <img src="https://skillicons.dev/icons?i=github" width="55" height="55" />
</a>

<a href="https://www.linkedin.com/in/yashwantbhole" target="_blank" style="margin: 0 10px;">
  <img src="https://skillicons.dev/icons?i=linkedin" width="55" height="55" />
</a>

<a href="mailto:yashwantbhole2004@gmail.com" target="_blank" style="margin: 0 10px;">
  <img src="https://img.shields.io/badge/Email-Contact%20Me-red?style=for-the-badge" />
</a>

<br/><br/>

🛠 *Backend & RAG Engineer — Node.js • Express • MongoDB*  
⚡ *Building scalable AI systems with modern architecture.*

</div>

---

## ⭐ Feedback
If this backend helped you, please ⭐ star the repo — it motivates me to build more open-source AI systems!

