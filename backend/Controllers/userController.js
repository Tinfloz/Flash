import asyncHandler from 'express-async-handler';
import Posts from '../Models/postModel.js';
import Users from '../Models/userModel.js';
import getToken from '../Utils/getAccessToken.js';

const registerUser = async (req, res) => {
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
        res.status(400);
        res.json({
            success: false,
            message: "Enter all fields"
        })
        throw new Error("Enter all fields")
    };
    const userExists = await Users.findOne({ email });
    if (userExists) {
        res.status(400);
        res.json({
            success: false,
            message: "User already exists"
        });
        throw new Error("User already exists");
    } else {
        try {
            const user = await Users.create({
                email,
                password,
                userName
            })
            if (user) {
                res.status(201);
                res.json({
                    success: true,
                    message: "User registered"
                });
            } else {
                res.status(500);
                res.json({
                    success: false,
                    message: "User could not be created"
                });
            };
        } catch (error) {
            res.status(500);
            res.json({
                success: false,
                message: error.message
            });
        };
    };
};

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        res.json({
            success: false,
            message: "Enter all fields"
        });
        throw new Error("Enter all fields");
    } else {
        const user = await Users.findOne({ email });
        if (user && await user.matchPassword(password)) {
            res.status(200);
            const token = getToken(user._id);
            res.cookie("token", token, {
                expires: new Date(Date.now() + 90 * 24 * 24 * 60 * 1000),
                httpOnly: true
            });
            res.json({
                success: true,
                message: "Login successful",
                token
            });
        } else {
            res.status(400);
            res.json({
                success: false,
                message: "Invalid credentials"
            })
            throw new Error("Invalid credentials")
        }
    }
});

const logoutUser = async (req, res) => {
    try {
        res.status(200);
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        res.json({
            success: true,
            message: "User logged out"
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    };
};

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await Users.findById(req.user._id);
    if (await user.matchPassword(oldPassword)) {
        user.password = newPassword;
        await user.save();
        res.status(200);
        res.json({
            success: true,
            message: "Password updated"
        })
    } else {
        res.status(400);
        res.json({
            success: false,
            message: "Passwords don't match"
        });
    };
};

const updateProfile = async (req, res) => {
    const user = await Users.findById(req.user._id);
    const { email, userName } = req.body;
    user.email = email || user.email;
    user.userName = userName || user.userName;
    try {
        const updatedUser = await user.save();
        if (updatedUser) {
            res.status(200);
            res.json({
                success: true,
                message: "User updated",
                updatedUser
            });
        } else {
            res.status(500);
            res.json({
                success: false,
                message: "User could not be updated"
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



const followUnfollow = async (req, res) => {
    const loggedInUser = await Users.findById(req.user._id);
    const userToFollow = await Users.findById(req.params.id);
    if (!userToFollow) {
        res.status(404);
        res.json({
            success: false,
            message: "user not found"
        });
    } else {
        try {
            if (loggedInUser.following.includes(req.params.id)) {
                const followingIndex = loggedInUser.following.indexOf(req.params.id);
                const followerIndex = userToFollow.followers.indexOf(req.user._id)
                loggedInUser.following.splice(followingIndex, 1);
                userToFollow.followers.splice(followerIndex, 1);
                await loggedInUser.save();
                await userToFollow.save();
                res.status(200);
                res.json({
                    success: true,
                    message: "User unfollowed"
                });
            } else {
                loggedInUser.following.push(req.params.id);
                userToFollow.followers.push(req.user._id);
                await loggedInUser.save();
                await userToFollow.save();
                res.status(200);
                res.json({
                    success: true,
                    mesage: "User followed"
                });
            };
        } catch (error) {
            res.status(500);
            console.error(error);
            res.json({
                success: false,
                message: error.message
            });
        };
    };
};

const deleteProfile = async (req, res) => {
    const user = await Users.findById(req.user._id)
    try {
        for (var i of user.posts) {
            const post = await Posts.findById(i);
            await post.remove();
        };
        await user.remove();
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        res.status(200);
        res.json({
            success: true,
            message: "User deleted"
        });
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    };
};

const myProfile = async (req, res) => {
    try {
        const user = await Users.findById(req.user._id);
        const posts = await user.populate("posts")
        res.status(200);
        res.json({
            success: true,
            posts
        });
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
    registerUser,
    loginUser,
    updatePassword,
    updateProfile,
    followUnfollow,
    logoutUser,
    deleteProfile,
    myProfile
}