const pdfParse = require('pdf-parse');
const { createWorker } = require('tesseract.js');

async function ocrImageBuffer(buffer) {
  const worker = await createWorker('eng');

  try {
    const { data } = await worker.recognize(buffer);
    await worker.terminate();
    return data.text || '';
  } catch (err) {
    try { await worker.terminate(); } catch (e) {}
    throw err;
  }
}

async function extractTextFromBuffer(buffer, mimetype = '') {
  if (!buffer) return '';

  mimetype = (mimetype || '').toLowerCase();

  // PDF handling
  if (mimetype.includes('pdf')) {
    try {
      const data = await pdfParse(buffer);
      return data.text || '';
    } catch (err) {
      console.error('pdf parse error', err);
      return '';
    }
  }

  // Image handling -> OCR
  if (
    mimetype.startsWith('image/') ||
    mimetype.includes('jpeg') ||
    mimetype.includes('png')
  ) {
    try {
      return await ocrImageBuffer(buffer);
    } catch (err) {
      console.error('ocr error', err);
      return '';
    }
  }

  // Fallback: treat as text
  try {
    return buffer.toString('utf8');
  } catch (err) {
    return '';
  }
}

module.exports = { extractTextFromBuffer };
