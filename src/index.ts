import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Live!');
});

app.listen(8080, () => {
  console.log('Server live on 8080!');
});