import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get('/', (req: Request, res: Response):void => {
  res.send('Express + TypeScript Server is running');
});

app.listen(port, ():void => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`);
});