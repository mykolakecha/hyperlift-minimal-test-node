const { Router } = require('express');
const crypto = require('crypto');
const http = require('http');
const https = require('https');

const router = Router();

// GET /network/outbound?url=https://example.com&requests=10
// Makes `requests` HTTP(S) GET requests to `url`.
router.get('/outbound', async (req, res) => {
  const targetUrl = req.query.url || 'https://httpbin.org/bytes/102400';
  const requests = Math.min(parseInt(req.query.requests) || 10, 500);

  const fetchUrl = (url) =>
    new Promise((resolve, reject) => {
      const mod = url.startsWith('https') ? https : http;
      mod.get(url, (response) => {
        let bytes = 0;
        response.on('data', (chunk) => (bytes += chunk.length));
        response.on('end', () => resolve(bytes));
        response.on('error', reject);
      }).on('error', reject);
    });

  const start = Date.now();
  let totalBytes = 0;
  let successes = 0;
  let failures = 0;

  const promises = [];
  for (let i = 0; i < requests; i++) {
    promises.push(
      fetchUrl(targetUrl)
        .then((bytes) => { totalBytes += bytes; successes++; })
        .catch(() => failures++)
    );
  }
  await Promise.all(promises);

  res.json({
    status: 'done',
    targetUrl,
    totalRequests: requests,
    successes,
    failures,
    totalBytesReceived: totalBytes,
    totalMBReceived: (totalBytes / 1024 / 1024).toFixed(2),
    durationMs: Date.now() - start,
  });
});

// GET /network/inbound?size=10
// Streams `size` MB of random data back to the caller.
router.get('/inbound', (req, res) => {
  const sizeMB = Math.min(parseInt(req.query.size) || 10, 500);
  const chunkSize = 64 * 1024;
  const totalBytes = sizeMB * 1024 * 1024;
  let sent = 0;

  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Length', totalBytes);

  function sendChunk() {
    let ok = true;
    while (sent < totalBytes && ok) {
      const remaining = totalBytes - sent;
      const size = Math.min(chunkSize, remaining);
      const buf = crypto.randomBytes(size);
      ok = res.write(buf);
      sent += size;
    }
    if (sent < totalBytes) {
      res.once('drain', sendChunk);
    } else {
      res.end();
    }
  }
  sendChunk();
});

module.exports = router;
