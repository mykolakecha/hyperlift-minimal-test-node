const { Router } = require('express');

const router = Router();

// GET /status — returns current process resource usage
router.get('/', (req, res) => {
  const mem = process.memoryUsage();
  const cpu = process.cpuUsage();
  res.json({
    uptime: `${Math.round(process.uptime())}s`,
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
      external: `${Math.round(mem.external / 1024 / 1024)} MB`,
    },
    cpu: {
      user: `${(cpu.user / 1e6).toFixed(2)}s`,
      system: `${(cpu.system / 1e6).toFixed(2)}s`,
    },
  });
});

module.exports = router;
