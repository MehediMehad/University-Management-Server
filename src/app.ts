import express, { Application, Request, Response } from 'express';
import cors from 'cors';
const app: Application = express();
const port = 3000;

//parsers
app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
  const s = 55;

  res.send(s);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

export default app;
