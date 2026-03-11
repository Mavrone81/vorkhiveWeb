const express = require('express');
const path = require('path');
const app = express();
const port = 4998;

// Explicitly bind to '0.0.0.0' to allow external traffic and avoid hostname issues
const host = '0.0.0.0'; 

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
