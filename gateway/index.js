const express = require('express');
const bodyParser = require('body-parser');

const serial = require('./serial');

const PORT = 8765;

const app = express();
app.use(bodyParser.json());

app.post('/setpixels', (req, res) => {
  serial.sendPixels(req.body);
  res.send('Ok');
});

serial.init().then((() => {
  app.listen(PORT, "localhost", () => {
    console.info(`Listening on port ${PORT}…`);
  });
}));

