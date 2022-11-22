import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser'
import mongoose from 'mongoose';
import postRoutes from './Routes/postRoutes.js';
import userRoutes from './Routes/userRoutes.js';
import errorHandler from './Middlewares/errorMiddleware.js';
import cloudinary from "cloudinary";

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

// cloudinary connect
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});


//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(cors());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json());

app.use('/api/post', postRoutes);
app.use('/api/users/', userRoutes);

app.use(errorHandler);
//listener
app.listen(port, () => `listening on ${port}`);