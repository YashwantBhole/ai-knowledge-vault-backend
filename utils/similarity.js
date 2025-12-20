function dot(a, b) {
    let s = 0;
    const len = Math.min(a.length, b.length);
    for (let i = 0; i < len; i++) {
        s += (a[i] || 0) * (b[i] || 0);
    }
    return s;
}

function norm(a) {
    return Math.sqrt(dot(a, a)) || 1e-12;
}

function cosineSim(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || b.length === 0) {
        return -1;
    }
    return dot(a, b) / (norm(a) * norm(b) + 1e-12);
}

module.exports = { cosineSim }