import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    image: {
        type: Buffer,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    like: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, { timestamps: true });

const Posts = mongoose.model("Posts", postSchema);
export default Posts;