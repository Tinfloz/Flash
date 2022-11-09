import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    },
    likes: [
        {
            owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            name: {
                type: String
            }
        }

    ],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    comments: [
        {
            owner: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            comment: {
                type: String,
                required: true
            }
        }
    ]
}, { timestamps: true });

const Posts = mongoose.model("Posts", postSchema);
export default Posts;