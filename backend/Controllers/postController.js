import asyncHandler from 'express-async-handler';
import Posts from '../Models/postModel.js'
import Users from '../Models/userModel.js';

// const getPosts = asyncHandler(async (req, res) => {
//     const posts = await Posts.find();
//     if (!posts) {
//         res.status(500);
//     } else {
//         res.status(200)
//     }
//     res.send(posts);

// });

// const setPosts = asyncHandler(async (req, res) => {
//     if (!req.body) {
//         res.status(400);
//         res.json({
//             success: false,
//             message: "enter all fields"
//         });
//     }
//     const { image, caption, like } = req.body;
//     const post = await Posts.create({
//         image,
//         caption,
//         like
//     })
//     if (post) {
//         res.status(201);
//         res.json({
//             success: true,
//             message: "post created"
//         })
//     } else {
//         res.json({
//             success: false,
//             message: "invalid user details"
//         });
//     };
// });

// const deletePosts = asyncHandler(async (req, res) => {
//     const posts = await Posts.findById(req.params.id)
//     if (!posts) {
//         res.status(500);
//         res.json({
//             success: false,
//             message: "Post not found"
//         })
//         throw new Error("Post not found")
//     }
//     await posts.remove()
//     res.status(200);
//     res.json({
//         id: req.params.id,
//         success: true
//     })
// });

// export {
//     getPosts,
//     setPosts,
//     deletePosts
// }

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

const getPosts = async (req, res) =>{
    
} 

export {
    setPosts,
    likeUnlikePosts,
    deletePosts
}