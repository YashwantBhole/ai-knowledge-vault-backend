const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref: "User" },
    fileName : String,
    fileType : String,
    fileSize : Number,
    s3Key : String,
    extractedText: String, 
}, {timestamps : true });

module.exports = mongoose.model("File", FileSchema);