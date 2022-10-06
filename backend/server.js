import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser'
dotenv.config();
const app = express();
const port = process.env.PORT || 9001;

//middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//test endpoint
app.get('/', (req, res) => {
    res.json({
        message: "hello world"
    });
});

//listener
app.listen(port, () => `listening on ${port}`);