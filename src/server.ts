import express from 'express';
import next from 'next';
import path from 'path';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = parseInt(process.env.PORT || ' 8080', 10);

app.prepare().then(() => {  
  const server = express();
  server.use(express.json());
  
  server.use('/api', (req, res) => {
    res.send('Live!');
  });
  
  server.get(/.*/, (req, res) => handle(req, res));

  server.listen(port, () => {
    console.log(`Server live on ${port}! (${dev ? 'development' : 'production'})`);
  });
});