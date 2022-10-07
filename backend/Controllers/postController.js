import asyncHandler from 'express-async-handler';
import Posts from '../Models/postModel.js'

const getPosts = asyncHandler(async (req, res) => {
    const posts = await Posts.find();
    if (!posts) {
        res.status(500);
    } else {
        res.status(200)
    }
    res.send(posts);

});

const setPosts = asyncHandler(async (req, res) => {
    if (!req.body) {
        res.status(400);
        res.json({
            success: false,
            message: "enter all fields"
        });
    }
    const { image, caption, like } = req.body;
    const post = await Posts.create({
        image,
        caption,
        like
    })
    if (post) {
        res.status(201);
        res.json({
            success: true,
            message: "post created"
        })
    } else {
        res.json({
            success: false,
            message: "invalid user details"
        });
    };
});

const deletePosts = asyncHandler(async (req, res) => {
    const posts = await Posts.findById(req.params.id)
    if (!posts) {
        res.status(500);
        res.json({
            success: false,
            message: "Post not found"
        })
        throw new Error("Post not found")
    }
    await posts.remove()
    res.status(200);
    res.json({
        id: req.params.id,
        success: true
    })
});

export {
    getPosts,
    setPosts,
    deletePosts
}