import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const PORT = 3000; 

app.use(express.json());

app.get('/api/tervehdys', (req: Request, res: Response) => {
  res.json({ viesti: "Hei palvelimelta!" });
});

app.listen(PORT, () => {
  console.log(`Serveri pyörii portissa ${PORT}`);
});



