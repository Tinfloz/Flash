import asyncHandler from 'express-async-handler';

const getPosts = asyncHandler(async (req, res) => {

});

const setPosts = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error("new error")
    } else {
        res.status(201);
        res.json({
            message: "you created a post"
        })
    }
});

const updatePosts = asyncHandler(async (req, res) => {

});

const deletePosts = asyncHandler(async (req, res) => {

});

export {
    getPosts,
    setPosts,
    updatePosts,
    deletePosts
}