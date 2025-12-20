function chunkText(text, maxLen = 800, overlap = 100) {
    if (!text) return [];
    const clean = String(text).replace(/\r\n/g, '\n');
    const chunks = [];
    let start = 0;
    while (start < clean.length) {
        const end = Math.min(start + maxLen, clean.length);
        const chunk = clean.slice(start, end).trim();
        if (chunk) chunks.push(chunk);
        if (end === clean.length) break;
        start = Math.max(0, end - overlap);
    }
    return chunks;
}

module.exports = { chunkText }