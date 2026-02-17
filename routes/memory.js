const { Router } = require('express');
const crypto = require('crypto');

const router = Router();

// GET /memory?size=128&duration=30
// Allocates `size` MB and holds it for `duration` seconds.
router.get('/', (req, res) => {
  const sizeMB = Math.min(parseInt(req.query.size) || 128, 2048);
  const duration = Math.min(parseInt(req.query.duration) || 30, 600);

  const chunks = [];
  const chunkSize = 1024 * 1024;
  for (let i = 0; i < sizeMB; i++) {
    const buf = Buffer.alloc(chunkSize);
    crypto.randomFillSync(buf);
    chunks.push(buf);
  }

  const memUsage = process.memoryUsage();
  res.json({
    status: 'allocated',
    allocatedMB: sizeMB,
    holdSeconds: duration,
    rss: `${Math.round(memUsage.rss / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)} MB`,
    releasesAt: new Date(Date.now() + duration * 1000).toISOString(),
  });

  setTimeout(() => {
    chunks.length = 0;
    if (global.gc) global.gc();
    console.log(`Released ${sizeMB} MB after ${duration}s`);
  }, duration * 1000);
});

module.exports = router;
