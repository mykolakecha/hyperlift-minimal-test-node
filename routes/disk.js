const { Router } = require('express');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const router = Router();

const TMP_DIR = path.join('/tmp', 'load-test');

// GET /disk?size=100&duration=30
// Writes `size` MB to disk, holds the file for `duration` seconds, then cleans up.
router.get('/', (req, res) => {
  const sizeMB = Math.min(parseInt(req.query.size) || 100, 2048);
  const duration = Math.min(parseInt(req.query.duration) || 30, 600);
  const filePath = path.join(TMP_DIR, `disk-${Date.now()}-${Math.random().toString(36).slice(2)}.bin`);

  fs.mkdirSync(TMP_DIR, { recursive: true });

  const chunkSize = 1024 * 1024;
  const start = Date.now();

  const fd = fs.openSync(filePath, 'w');
  for (let i = 0; i < sizeMB; i++) {
    const buf = crypto.randomBytes(chunkSize);
    fs.writeSync(fd, buf);
  }
  fs.closeSync(fd);

  const writeMs = Date.now() - start;

  res.json({
    status: 'written',
    filePath,
    sizeMB,
    writeDurationMs: writeMs,
    writeThroughputMBps: ((sizeMB / writeMs) * 1000).toFixed(1),
    holdSeconds: duration,
    cleansUpAt: new Date(Date.now() + duration * 1000).toISOString(),
  });

  setTimeout(() => {
    try {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up ${filePath}`);
    } catch (e) {
      console.error(`Failed to clean up ${filePath}:`, e.message);
    }
  }, duration * 1000);
});

module.exports = router;
