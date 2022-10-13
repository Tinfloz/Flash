import asyncHandler from 'express-async-handler';
import Posts from '../Models/postModel.js';
import Users from '../Models/userModel.js';
import getToken from '../Utils/getAccessToken.js';
import sendEmail from '../Middlewares/resetPassword.js';
import crypto from "crypto";

const registerUser = async (req, res) => {
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
        res.status(400);
        res.json({
            success: false,
            message: "Enter all fields"
        })
        return;
    };
    const userExists = await Users.findOne({ email });
    if (userExists) {
        res.status(400);
        res.json({
            success: false,
            message: "User already exists"
        });
        return;
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
        };
    };
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
    const user = await Users.findById(req.user._id);
    try {
        for (let i of user.posts) {
            const post = await Posts.findById(i);
            console.log("post:", post)
            await post.remove()
        };
        for (let j of user.following) {
            const followedUser = await Users.findById(j);
            if (followedUser.followers.includes(req.user._id)) {
                const deletedUserIndex = followedUser.followers.indexOf(req.user._id);
                followedUser.followers.splice(deletedUserIndex, 1);
                await followedUser.save();
            } else {
                continue;
            }
        };
        for (let k of user.following) {
            const followedUser = await Users.findById(k);
            if (followedUser.following.includes(req.user._id)) {
                const deletedUser = followedUser.following.indexOf(req.user._id);
                followedUser.following.splice(deletedUser, 1);
                await followedUser.save();
            } else {
                continue;
            };
        }
        await user.remove();
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true
        });
        res.status(200);
        res.json({
            success: true,
            message: "User has been deleted"
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

const getUserProfile = async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user) {
            res.status(404);
            res.json({
                success: false,
                message: "User not found"
            });
        };
        console.log(user.posts.length);
        if (user.posts.length !== 0) {
            const posts = await user.populate("posts");
            res.status(200);
            res.json({
                success: true,
                message: "User profile found",
                user
            });
        } else {
            res.status(200);
            res.json({
                success: true,
                message: "User has no posts",
                user
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

const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400);
            res.json({
                success: false,
                message: "Please enter a valid email to reset password"
            });
            return;
        };
        const user = await Users.findOne({ email });
        if (!user) {
            res.status(400);
            res.json({
                success: false,
                message: "User not found"
            });
            return;
        };
        const resetToken = user.getResetPasswordToken();
        await user.save();
        const resetUrl = `${req.protocol}://${req.get("host")}/api/users/password/reset/${resetToken}`;
        const message = `Reset your password by clicking on the link: ${resetUrl}`;
        try {
            await sendEmail({
                email,
                subject: "Reset your password",
                message
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordTokenExpires = undefined;
            await user.save();
            console.error(error);
            res.status(500);
            res.json({
                success: false,
                message: error.messsage
            });
        };
        res.status(200);
        res.json({
            success: true,
            message: `Email has been sent to ${email}`
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

const resetPassword = async (req, res) => {
    const resetToken = req.params.token;
    const resetTokenHashed = crypto.createHash("sha256").update(resetToken).digest("hex");
    const user = await Users.findOne({
        resetPasswordToken: resetTokenHashed,
        resetPasswordTokenExpires: { $gt: Date.now() }
    });
    if (!user) {
        res.status(401);
        res.json({
            success: false,
            message: "Token has expired or invalid token"
        });
    } else {
        try {
            const { newPassword } = req.body;
            if (!newPassword) {
                res.status(400);
                res.json({
                    success: false,
                    message: "Kindly enter a valid password"
                });
                return;
            }
            user.password = newPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordTokenExpires = undefined;
            await user.save();
            res.status(200);
            res.json({
                success: true,
                message: "Password updated"
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
};

export {
    registerUser,
    loginUser,
    updatePassword,
    updateProfile,
    followUnfollow,
    logoutUser,
    deleteProfile,
    myProfile,
    getUserProfile,
    forgetPassword,
    resetPassword
};


