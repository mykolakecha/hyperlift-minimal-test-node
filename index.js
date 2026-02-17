const express = require('express');

const cpuRoutes = require('./routes/cpu');
const memoryRoutes = require('./routes/memory');
const networkRoutes = require('./routes/network');
const diskRoutes = require('./routes/disk');
const statusRoutes = require('./routes/status');

const app = express();
const port = process.env.APPLICATION_PORT || 9191;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test123', (req, res) => {
  res.send('test 123');
});

app.use('/cpu', cpuRoutes);
app.use('/memory', memoryRoutes);
app.use('/network', networkRoutes);
app.use('/disk', diskRoutes);
app.use('/status', statusRoutes);

app.listen(port);

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
