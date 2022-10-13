import asyncHandler from 'express-async-handler';
import Posts from '../Models/postModel.js'
import Users from '../Models/userModel.js';
import mongoose from "mongoose";

const setPosts = async (req, res) => {
    const { image, caption } = req.body;
    if (!image) {
        res.status(400);
        res.json({
            success: false,
            message: "image is required to create post"
        })
        throw new Error("Add image to create post")
    } else {
        const userId = req.user._id;
        const post = await Posts.create({
            image,
            caption,
            userId
        });
        if (post) {
            const user = await Users.findById(req.user._id);
            res.status(201);
            res.json({
                success: true,
                message: "Post successfully created",
                post
            })
            user.posts.push(post._id);
            await user.save();
        } else {
            res.status(500);
            res.json({
                success: false,
                message: "Post could not be created"
            });
            throw new Error("Post could not be created")
        };
    };
};

const likeUnlikePosts = async (req, res) => {
    const userId = req.user._id;
    const post = await Posts.findById(req.params.id);
    if (!post) {
        res.status(404)
        res.json({
            success: false,
            message: "Post not found"
        });
    } else {
        if (post.likes.includes(userId)) {
            const likeIndex = post.likes.indexOf(userId);
            post.likes.splice(likeIndex, 1);
            await post.save();
            res.status(200);
            res.json({
                success: true,
                message: "Post Unliked"
            });
        } else {
            post.likes.push(userId);
            await post.save();
            res.status(200);
            res.json({
                success: true,
                message: "Post liked"
            });
        };
    };
};

const deletePosts = async (req, res) => {
    const post = await Posts.findById(req.params.id);
    const user = await Users.findById(req.user._id);
    if (!post) {
        res.status(404);
        res.json({
            success: false,
            message: "Post not found"
        });
    } else {
        if (post.userId.toString() !== req.user._id.toString()) {
            res.status(400);
            res.json({
                success: false,
                message: "Unauthorized"
            });
        } else {
            res.status(200);
            const postIndex = user.posts.indexOf(req.params.id);
            user.posts.splice(postIndex, 1);
            await user.save();
            await post.remove();
            res.json({
                success: true,
                message: "Post deleted"
            });
        };
    };
};

// getting posts of followings
const getPosts = async (req, res) => {
    const loggedInUser = await Users.findById(req.user._id);
    const posts = await Posts.find({
        userId: {
            $in: loggedInUser.following
        }
    });
    res.status(200);
    res.json({
        success: true,
        posts
    });
};

const updateCaption = async (req, res) => {
    const { newCaption } = req.body;
    const post = await Posts.findById(req.params.id);
    if (!post) {
        res.status(404);
        res.json({
            success: false,
            message: "Post not found"
        });
    } else {
        try {
            if (post.userId.toString() === req.user._id.toString()) {
                post.caption = newCaption;
                const updatedPost = await post.save();
                if (updatedPost) {
                    res.status(200);
                    res.json({
                        success: true,
                        message: "Caption updated"
                    });
                } else {
                    res.status(500);
                    res.json({
                        success: false,
                        message: "Caption could not be updated"
                    });
                };
            } else {
                res.status(400);
                res.json({
                    success: false,
                    message: "Unauthorized"
                });
            };

        } catch {
            console.error(error);
            res.status(500);
            res.json({
                success: false,
                message: error.message
            });
        };
    };
};

//add comments to posts
const addComment = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        res.json({
            success: false,
            message: "Invalid ID"
        });
        return
    }
    const post = await Posts.findById(req.params.id);
    if (!post) {
        res.status(404);
        res.json({
            success: false,
            message: "Post not found"
        });
        return
    };
    const { comment } = req.body;
    if (!comment) {
        res.status(400);
        res.json({
            success: false,
            message: "Please enter a valid comment"
        });
        return;
    };
    try {
        let commentExist = false;
        let index;
        for (let i of post.comments) {
            if (i.owner.toString() == req.user._id.toString()) {
                commentExist = true;
                index = post.comments.indexOf(i);
            }
        };
        if (commentExist) {
            post.comments[index].comment = comment;
            await post.save();
            res.status(200);
            res.json({
                success: true,
                message: "Comment has been updated"
            });
        } else {
            post.comments.push({
                owner: req.user._id,
                comment
            });
            await post.save();
            res.status(200);
            res.json({
                success: true,
                message: "Comment has been posted"
            });
        };
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    };
};

export {
    setPosts,
    likeUnlikePosts,
    deletePosts,
    getPosts,
    updateCaption,
    addComment
}