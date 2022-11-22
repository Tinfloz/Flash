import Posts from '../Models/postModel.js'
import Users from '../Models/userModel.js';
import mongoose from "mongoose";
import cloudinary from "cloudinary"

//upload posts
// const setPosts = async (req, res) => {
//     try {
//         const { image, caption } = req.body;
//         if (!image) {
//             throw "Kindly upload an image"
//         }
//         const userId = req.user._id;
//         const user = await Users.findById(userId)
//         const post = await Posts.create({
//             image,
//             caption,
//             userId
//         });
//         if (!post) {
//             throw "post could not be created";
//         } else {
//             res.status(201).json({
//                 success: true,
//                 message: "Post created",
//                 post
//             });
//             user.posts.push(post._id);
//             await user.save();
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Post could not be created ",
//             error: error.errors?.[0]?.message || error
//         });
//     };
// };

// like and unlike posts
const likeUnlikePosts = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "post id not valid"
        }
        const post = await Posts.findById(req.params.id)
        if (!post) {
            throw "post not found"
        }
        let likeExist = false;
        let likeIndex;
        for (let i of post.likes) {
            if (req.user._id.toString() === i.owner.toString()) {
                likeExist = true;
                likeIndex = post.likes.indexOf(i);
            };
        };
        if (likeExist) {
            post.likes.splice(likeIndex, 1);
            await post.save();
            res.status(200).json({
                success: true,
                message: "post unliked",
                likes: post.likes,
                post: post._id
            });
        } else {
            const user = await Users.findById(req.user._id);
            post.likes.push({
                owner: req.user._id,
                name: user.userName
            });
            await post.save()
            res.status(200).json({
                success: true,
                message: "post liked",
                likes: post.likes,
                post: post._id
            });
        }

    } catch (error) {
        console.log(error);
        if (error === "post id not valid") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
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
                id: post._id
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
    }).populate("userId");
    res.status(200);
    res.json({
        success: true,
        posts
    });
};

//update caption
const updateCaption = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw "not valid"
        }
        const post = await Posts.findById(id);
        if (!post) throw "post not found";
        if (post.userId.toString() !== req.user._id.toString()) {
            throw "not authorized to update caption";
        }
        const { caption } = req.body;
        if (!caption) {
            throw "enter a caption to proceed";
        }
        post.caption = caption;
        await post.save();
        res.status(200).json({
            success: true,
            postId: post._id,
            caption
        });
    } catch (error) {
        if (error === "not valid") {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error

            })
        } else if (error === "post not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error

            })
        } else if (error === "enter a caption to proceed") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error

            });
        };
    };
};

//delete comment
// const deleteComment = async (req, res) => {
//     try {
//         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//             throw "Invalid post ID";
//         };
//         const post = await Posts.findById(req.params.id);
//         if (!post) {
//             throw "Post not found";
//         };
//         if (post.userId.toString() === req.user._id.toString()) {
//             const { commentId } = req.body;
//             if (!commentId) {
//                 throw "Please provide comment ID";
//             } else {
//                 for (let i of post.comments) {
//                     if (i._id.toString() === commentId.toString()) {
//                         const commentIndex = post.comments.indexOf(i);
//                         post.comments.splice(commentIndex, 1);
//                         await post.save();
//                     };
//                 };
//                 res.status(200).json({
//                     success: true,
//                     message: "comment has been deleted"
//                 });
//             }

//         } else {
//             for (let k of post.comments) {
//                 if (k.owner.toString() === req.user._id.toString()) {
//                     const commentIndex = post.comments.indexOf(k);
//                     post.comments.splice(commentIndex, 1);
//                     await post.save();
//                 }
//             };
//             res.status(200).json({
//                 success: true,
//                 message: "comment has been deleted"
//             });
//         };
//     } catch (error) {
//         console.error(error);
//         if (error === "Invalid post ID") {
//             res.status(500).json({
//                 success: false,
//                 error: error.errors?.[0]?.message || error
//             });
//         } else if (error === "Post not found") {
//             res.status(404).json({
//                 success: false,
//                 error: error.errors?.[0]?.message || error
//             });
//         } else {
//             res.status(400).json({
//                 success: false,
//                 error: error.errors?.[0]?.message || error
//             })
//         };
//     };
// };

// get all logged in user posts
const getLoggedInPosts = async (req, res) => {
    try {
        const posts = await Posts.find({
            userId: {
                $in: req.user._id
            }
        }).populate("userId");
        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};


// get posts of searched user
const getSearchedUserPosts = async (req, res) => {
    try {
        const { name } = req.params;
        const searchedUser = await Users.findOne({
            userName: name
        }).select("visibility followers following pendingRequests sentRequests _id")
        if (!searchedUser) {
            throw "User not found"
        };
        const posts = await Posts.find({
            userId: {
                $in: searchedUser._id
            }
        }).populate("userId", "userName _id")
        if (searchedUser.visibility === "Public" || searchedUser.visibility === "Private" && searchedUser.followers.includes(req.user._id)) {
            res.status(200).json({
                success: true,
                posts,
                searchedUser,
                loggedInUser: req.user._id
            });
        };
        if (searchedUser.visibility === "Private" && !searchedUser.followers.includes(req.user._id)) {
            res.status(200).json({
                success: true,
                posts: [],
                searchedUser,
                loggedInUser: req.user._id
            });
        };
    } catch (error) {
        if (error === "User not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
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
    deleteComment,
    getLoggedInPosts,
    getSearchedUserPosts,
    editComment
}

//add comment 
const addComment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "post id is not valid"
        };
        const post = await Posts.findById(req.params.id);
        if (!post) {
            throw "post not found"
        };
        const user = await Users.findById(req.user._id);
        const { comment } = req.body;
        if (!comment) {
            throw "enter a comment"
        };
        post.comments.push({
            owner: user.userName,
            comment
        });
        await post.save();
        res.status(200).json({
            success: true,
            postId: req.params.id,
            comment: post.comments
        })
    } catch (error) {
        if (error === "post id is not valid") {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        } else if (error === "post not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        } else if (error === "enter a comment") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// edit comment
const editComment = async (req, res) => {
    try {
        const user = await Users.findById(req.user._id);
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "id not valid"
        };
        const post = await Posts.findById(req.params.id);
        if (!post) {
            throw "post not found"
        };
        const { comment } = req.params;
        console.log(comment)
        post.comments.map(async com => {
            if (com._id.toString() === comment.toString()) {
                if (com.owner === user.userName) {
                    const { newComment } = req.body;
                    com.comment = newComment;
                    await post.save();
                    res.status(200).json({
                        success: true,
                        newComment,
                        commentId: com._id,
                        postId: req.params.id
                    })
                } else {
                    res.status(403).json({
                        success: false,
                        error: "not authorized to delete comment"
                    });
                    return
                };
            };
        });
    } catch (error) {
        if (error === "id not valid") {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "post not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};


// delete comment
const deleteComment = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.post, req.params.comment)) {
            throw "invalid ids";
        };
        const post = await Posts.findById(req.params.post);
        if (!post) {
            throw "post not found"
        };
        post.comments.map(async com => {
            if (com._id.toString() === req.params.comment.toString()) {
                const index = post.comments.indexOf(req.params.comment);
                post.comments.splice(index, 1);
                await post.save();
                res.status(200).json({
                    success: true,
                    postId: req.params.post,
                    commentId: com._id
                });
            };
        });
    } catch (error) {
        if (error === "invalid id") {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        } else if (error === "post not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};


const setPosts = async (req, res) => {
    try {
        const { image, caption } = req.body;
        if (!image) {
            throw "No image uploaded"
        };
        const user = await Users.findById(req.user._id)
        const cloudResponse = await cloudinary.v2.uploader.upload(req.body.image, {
            folder: "Flash App",
        });
        console.log(cloudResponse)
        const post = await Posts.create({
            image: {
                publicId: cloudResponse.public_id,
                url: cloudResponse.secure_url
            },
            caption,
            userId: user._id
        });
        if (!post) {
            throw "post could not be created"
        }
        user.posts.push(post._id);
        await user.save();
        res.status(201).json({
            success: true,
            message: "post has been created"
        })
    } catch (error) {
        if (error === "No image uploaded") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        } else if (error === "post could not be created" || error) {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};