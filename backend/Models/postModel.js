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
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    }
}, { timestamps: true });

const Posts = mongoose.model("Posts", postSchema);
export default Posts;