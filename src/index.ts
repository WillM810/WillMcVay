import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('/api', (req, res) => {
  res.send('Live!');
});

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

app.listen(8080, () => {
  console.log('Server live on 8080!');
});