const express = require('express')
const app = express()
const port = process.env.APPLICATION_PORT || 9191;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/test123', (req, res) => {
  res.send('test 123');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
