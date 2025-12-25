<div align="center">

# 🧠 AI Knowledge Vault — Backend (Node.js • Express • RAG Engine)

A **production-ready backend** powering the AI Knowledge Vault — a Hybrid Retrieval-Augmented Generation (RAG) system that converts uploaded documents into a semantic, searchable knowledge base with grounded AI answers.

</div>

---

## 🔗 Related Repositories

- **Frontend App:** https://github.com/YashwantBhole/ai-knowledge-vault-frontend  
- **Live App:** https://rag-ai-engine.netlify.app  

---

## 📌 Overview

This repository contains the **backend API** for AI Knowledge Vault.  
It is responsible for:

- 🔐 Authentication & secure user isolation  
- 📁 File uploads (PDF, DOCX, TXT, images)  
- 📝 Text extraction (including OCR)  
- ✂️ Chunking & preprocessing  
- 🧠 Embedding generation  
- 🔍 Vector search  
- 🤖 Grounded AI responses via a RAG pipeline  

Built using **Node.js, Express, MongoDB** and **Gemini models** for embeddings & generation.

---

## 🚀 Key Features

### 🔐 Authentication & User Isolation
✔ JWT-based authentication  
✔ Per-user file & embedding segregation  
✔ Prevents cross-user data access  

### 📁 File Handling
✔ Upload **PDF / DOCX / TXT / PNG / JPG**  
✔ Stored securely in **Backblaze B2 (S3 compatible)**  
✔ Signed URLs for secure download  

### 📝 Text Extraction
✔ `pdf-parse` for PDFs  
✔ `mammoth` for DOCX  
✔ `tesseract.js` OCR for images  

### ✂️ Chunking Engine
✔ Overlapping semantic chunks  
✔ Configurable sizes  
✔ Optimized for vector retrieval  

### 🧠 Embeddings & Vector Search
✔ Gemini embedding model  
✔ Stored as vectors in MongoDB  
✔ Cosine similarity search  

### 🤖 Ask-AI (RAG Pipeline)
✔ Retrieve top-K matches  
✔ Construct contextual prompts  
✔ Generate grounded responses  
✔ Include reference context  

---

## 🏗️ Architecture


```
Client → Express API → Controllers → RAG Pipeline → Gemini → Response
```


### Request Flow
1️⃣ Upload file → stored in B2  
2️⃣ Extract text  
3️⃣ Create chunks  
4️⃣ Generate embeddings  
5️⃣ Store vectors  
6️⃣ Ask AI → retrieve → answer  

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
> 🔎 Never commit `.env` files — keys must remain secret.
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

## 👤 Author & Connect With Me

<div align="center">

### **Yashwant Bhole**

<p align="center">  
  <a href="https://www.linkedin.com/in/yashwantbhole/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
  <a href="mailto:yashwantbhole2004@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail"/>
  </a>
  <a href="https://github.com/YashwantBhole" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
</p>

💼 *Full Stack Developer — MERN • Java • Spring Boot*  
🌟 *Building AI-powered systems with clean architecture and strong UI/UX.*

</div>

---

## ⭐ Feedback
If this backend helped you, please ⭐ star the repo — it motivates me to build more open-source AI systems!

