import express from "express";
import bodyParser from "body-parser";
import * as dotenv from 'dotenv';
import prisma from './prisma';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const app = express();
app.use(bodyParser.json());
const port = 3000;

const basePath = path.join(__dirname, '/controller');
fs.readdir(basePath, async (err, files) => {
  await Promise.all(files.map(async (file) => {
    const controller = await import(`${basePath}/${file}`);
    app.use(controller.default);
  }));
});

app.listen(port, async () => {
  await prisma.$connect();
  console.log(`Example app listening at http://localhost:${port}`)
});
