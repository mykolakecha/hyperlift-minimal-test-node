const { Router } = require('express');

const router = Router();

// GET /cpu?duration=5&threads=1
// Burns CPU for `duration` seconds across `threads` workers.
router.get('/', (req, res) => {
  const duration = Math.min(parseInt(req.query.duration) || 5, 300);
  const threads = Math.min(parseInt(req.query.threads) || 1, 8);
  const endTime = Date.now() + duration * 1000;

  let completed = 0;
  for (let t = 0; t < threads; t++) {
    setImmediate(function burn() {
      if (Date.now() < endTime) {
        for (let i = 0; i < 1e5; i++) Math.sqrt(Math.random());
        setImmediate(burn);
      } else {
        completed++;
        if (completed === threads) {
          res.json({ status: 'done', duration, threads });
        }
      }
    });
  }
});

module.exports = router;
