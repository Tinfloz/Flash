import asyncHandler from 'express-async-handler';
import Posts from '../Models/postModel.js'
import Users from '../Models/userModel.js';
import mongoose from "mongoose";

//upload posts
const setPosts = async (req, res) => {
    try {
        const { image, caption } = req.body;
        if (!image) {
            throw "Kindly upload an image"
        }
        const userId = req.user._id;
        const user = await Users.findById(userId)
        const post = await Posts.create({
            image,
            caption,
            userId
        });
        if (!post) {
            throw "post could not be created";
        } else {
            res.status(201).json({
                success: true,
                message: "Post created",
                post
            });
            user.posts.push(post._id);
            await user.save();
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Post could not be created ",
            error: error.errors?.[0]?.message || error
        });
    };
};

// like and unlike posts
const likeUnlikePosts = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "invalid post ID"
        }
        const post = await Posts.findById(req.params.id);
        if (post.likes.includes(req.user.id)) {
            const index = post.likes.indexOf(req.user.id);
            post.likes.splice(index, 1);
            await post.save();
            res.status(200).json({
                success: true,
                message: "post unliked"
            });
        } else {
            post.likes.push(req.user._id);
            await post.save();
            res.status(200).json({
                success: true,
                message: "post liked"
            });
        };
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "failed",
            error: error.errors?.[0]?.message || error
        });
    };

};

// delete posts
const deletePosts = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "invalid post ID"
        };
        const user = await Users.findById(req.user._id);
        const post = await Posts.findById(req.params.id);
        if (!post) {
            throw "post not found"
        }
        if (post.userId.toString() !== req.user._id.toString()) {
            throw "Not authorized to delete post";
        } else {
            const postIndex = user.posts.indexOf(req.params.id);
            user.posts.splice(postIndex, 1);
            await user.save();
            await post.remove();
            res.status(200).json({
                success: true,
                message: "Post deleted",
            });
        };
    } catch (error) {
        console.error(error);
        res.status(403).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
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

//update caption
const updateCaption = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "invalid post ID"
        };
        const post = await Posts.findById(req.params.id);
        if (!post) {
            throw "Post not found"
        };
        if (post.userId.toString() !== req.user._id.toString()) {
            throw "Not authorized to update caption"
        } else {
            const { caption } = req.body;
            post.caption = caption;
            await post.save();
            res.status(200).json({
                success: true,
                message: "Caption updated"
            });
        };
    } catch (error) {
        console.error(error);
        if (error === "invalid post ID") {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "Post not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(403).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        };
    };
};

//add comments to posts
const addComment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "Invalid post ID"
        };
        const post = await Posts.findById(req.params.id)
        if (!post) {
            throw "Post not found"
        };
        const { comment } = req.body;
        if (!comment) {
            throw "Kindly upload a valid comment";
        };
        let commentExists = false;
        let index;
        for (let i of post.comments) {
            if (req.user._id.toString() === i.owner.toString()) {
                commentExists = true;
                index = post.comments.indexOf(i);
            };
        };
        if (commentExists) {
            post.comments[index].comment = comment;
            await post.save();
            res.status(200).json({
                success: true,
                message: "Comment has been updated"
            });
        } else {
            post.comments.push({
                owner: req.user._id,
                comment
            });
            await post.save();
            res.status(200).json({
                success: true,
                message: "Comment has been posted"
            });
        };
    } catch (error) {
        console.error(error);
        if (error === "Invalid post ID") {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "Post not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        };
    };
};

//delete comment
const deleteComment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "Invalid post ID";
        };
        const post = await Posts.findById(req.params.id);
        if (!post) {
            throw "Post not found";
        };
        if (post.userId.toString() === req.user._id.toString()) {
            const { commentId } = req.body;
            if (!commentId) {
                throw "Please provide comment ID";
            } else {
                for (let i of post.comments) {
                    if (i._id.toString() === commentId.toString()) {
                        const commentIndex = post.comments.indexOf(i);
                        post.comments.splice(commentIndex, 1);
                        await post.save();
                    };
                };
                res.status(200).json({
                    success: true,
                    message: "comment has been deleted"
                });
            }

        } else {
            for (let k of post.comments) {
                if (k.owner.toString() === req.user._id.toString()) {
                    const commentIndex = post.comments.indexOf(k);
                    post.comments.splice(commentIndex, 1);
                    await post.save();
                }
            };
            res.status(200).json({
                success: true,
                message: "comment has been deleted"
            });
        };
    } catch (error) {
        console.error(error);
        if (error === "Invalid post ID") {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "Post not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        };
    };
};

export {
    setPosts,
    likeUnlikePosts,
    deletePosts,
    getPosts,
    updateCaption,
    addComment,
    deleteComment
}

