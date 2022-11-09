import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import postRoutes from './Routes/postRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import errorHandler from './Middlewares/errorMiddleware.js';
// import cloudinary from "./cloudinary/cloudinary";

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
app.use('/api/users/', userRoutes);

app.use(errorHandler);
//listener
app.listen(port, () => `listening on ${port}`);