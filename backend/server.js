import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import postRoutes from './Routes/postRoutes.js';
import errorHandler from './Middlewares/errorMiddleware.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 9001;

//connect to mongo db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => {
    console.log("connect to the database");
}).catch(err => {
    console.error(err);
});

//middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/post', postRoutes);

app.use(errorHandler);
//test endpoint
// app.get('/', (req, res) => {
//     res.json({
//         message: "hello world"
//     });
// });

//listener
app.listen(port, () => `listening on ${port}`);