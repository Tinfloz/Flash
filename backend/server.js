import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser'
dotenv.config();
const app = express();
const port = process.env.PORT || 9001;

//middlewares
app.use(express.json());

