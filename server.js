const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const User = require("./models/User");
const File = require("./models/File");
const Chunk = require('./models/Chunk');

const auth = require("./middleware/auth");

const { extractTextFromBuffer } = require('./utils/extractTextFromBuffer');
const { chunkText } = require('./utils/chunker')
const { getEmbedding } = require('./utils/geminiEmbeddings')
const { cosineSim } = require('./utils/similarity');
const { generateAnswerFromDocs } = require('./utils/geminiChat');

require("dotenv").config();


const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI).then(() =>
  console.log("MongoDB connected")
);


const upload = multer({ storage: multer.memoryStorage() });

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: process.env.B2_S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.B2_ACCESS_KEY_ID,
    secretAccessKey: process.env.B2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

// SIGNUP
app.post("/api/signup", async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    res.json({ message: "user created", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
if (!email?.trim() || !password?.trim()) {
  return res.status(400).json({ message: "All fields are required" });
}

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPLOAD FILE
app.post("/api/upload", auth, upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const key = `${Date.now()}_${file.originalname}`;

  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.B2_BUCKET,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const newFile = await File.create({
      userId: req.user,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      s3Key: key,
    });

    res.json(newFile);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// LIST FILES
app.get("/api/files", auth, async (req, res) => {
  try {
    const files = await File.find({ userId: req.user });
    res.json(files);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DOWNLOAD FILE
app.get("/api/files/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user) {
      return res.status(404).json({ message: "File not found" });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET,
      Key: file.s3Key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
    res.json({ url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE FILE
app.delete("/api/files/:id", auth, async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file || file.userId.toString() !== req.user) {
      return res.status(404).json({ message: "File not found" });
    }

    //Delete from B2
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.B2_BUCKET,
        Key: file.s3Key,
      })
    );

    //2) Delete chunks for this file
    await Chunk.deleteMany({ fileId: file._id });

    //Delete file docs
    await File.findByIdAndDelete(req.params.id);

    res.json({ message: "File and related chunks are deleted" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


//FILE PROCESSING
app.post("/api/process-file/:id", auth, async (req, res) => {

  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user });
    if (!file) return res.status(404).json({ message: 'file not found' });
    if (!file.s3Key) return res.status(400).json({ message: 'missing s3Key' });

    const command = new GetObjectCommand({
      Bucket: process.env.B2_BUCKET,
      Key: file.s3Key,
    });

    const s3Response = await s3.send(command);

    // Convert Body (Readable stream / Uint8Array / Buffer) into Buffer
    let buffer;
    if (Buffer.isBuffer(s3Response.Body)) {
      buffer = s3Response.Body;
    } else if (s3Response.Body instanceof Uint8Array) {
      buffer = Buffer.from(s3Response.Body);
    } else {
      const chunks = [];
      for await (const chunk of s3Response.Body) {
        chunks.push(Buffer.from(chunk));
      }
      buffer = Buffer.concat(chunks);
    }

    // Extract text from buffer
    const text = await extractTextFromBuffer(buffer, file.fileType || '');

    // Save and respond
    file.extractedText = text;
    await file.save();

    res.json({
      message: 'text extraction complete',
      extractedPreview: (text || '').slice(0, 300),
    });

  } catch (error) {
    console.error('process-file error', error);
    res.status(500).json({ error: error.message });
  }
})


//Creating Chunks
app.post('/api/create-chunks/:id', auth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user });
    if (!file) return res.status(404).json({ message: "file not found" });
    if (!file.extractedText) return res.status(400).json({ message: "No extracted text found, /run process-file first " });

    const MAX_LEN = 800;
    const OVERLAP = 100;

    const chunks = chunkText(file.extractedText, MAX_LEN, OVERLAP);
    if (chunks.length === 0) return res.json({ message: "no chunks created ", count: 0 });

    ///remove any existing chunk
    await Chunk.deleteMany({ fileId: file._id });

    //save chunks
    const created = [];
    for (const txt of chunks) {
      const c = await Chunk.create({
        fileId: file._id,
        userId: file.userId,
        text: txt
      });
      created.push(c);
    }

    res.json({ message: "chunks created ", count: created.length });

  } catch (error) {
    console.log("create chunks error", error)
    res.status(500).json({ error: error.message })
  }
})


//Create Embeddings
app.post('/api/create-embeddings/:id', auth, async (req, res) => {
  try {
    const file = await File.findOne({ _id: req.params.id, userId: req.user });
    if (!file) return res.status(400).json({ message: "file not found" });

    const chunks = await Chunk.find({ fileId: file._id, userId: file.userId });
    if (chunks.lenght === 0) {
      return res.status(400).json({ message: "no chunks found ; run api/create-chunks first " });
    }

    let updated = 0;
    for (const ch of chunks) {
      //skip already embedded chunks 
      if (ch.embedding && ch.embedding.lenght > 0) continue;

      const emb = await getEmbedding(ch.text);
      ch.embedding = emb;
      await ch.save();
      updated++;
    }
    res.json({ message: "embedding created", count: updated })
  } catch (error) {
    console.log("create chunks error", error)
    res.status(500).json({ error: error.message })
  }
})

//Ask Docs 
app.post("/api/ask-docs", auth, async (req, res) => {
  try {
    const { question, fileId } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ message: "question is required" });
    }

    // 1) Embed the question
    const qEmb = await getEmbedding(question);
    if (!qEmb || qEmb.length === 0) {
      return res.status(500).json({ message: "failed to embed question" });
    }

    // 2) Get candidate chunks for this user (optionally for one file)
    const filter = { userId: req.user };
    if (fileId) filter.fileId = fileId;

    const candidates = await Chunk.find(filter).limit(300);
    if (candidates.length === 0) {
      return res.status(400).json({ message: "no chunks found for this user" });
    }

    // 3) Score chunks by cosine similarity
    const scored = candidates.map((c) => ({
      id: c._id,
      fileId: c.fileId,
      text: c.text,
      score: cosineSim(qEmb, c.embedding || []),
    }));

    scored.sort((a, b) => b.score - a.score);

    // take top 5 chunks as context
    const top = scored.slice(0, 5);
    const contextTexts = top.map((t) => t.text);

    // 4) Ask Gemini to answer using those context chunks
    const answer = await generateAnswerFromDocs(question, contextTexts);

    res.json({
      answer,
      usedChunks: top, // optional, useful for debugging/explanations
    });
  } catch (err) {
    console.error("ask-docs error", err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
