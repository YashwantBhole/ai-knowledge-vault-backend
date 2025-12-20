const mongoose = require('mongoose');

const ChunkSchema = new mongoose.Schema({
    fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File", index: "true" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: "true" },
    text: { type: String },
    embedding: { type: [Number], default: [] },
    createdAt: { type: Date, default: Date.now() }
})

module.exports = mongoose.model("Chunk", ChunkSchema);