import Posts from '../Models/postModel.js';
import Users from '../Models/userModel.js';
import getToken from '../Utils/getAccessToken.js';
import sendEmail from '../Middlewares/resetPassword.js';
import crypto from "crypto";
import { serialize } from 'v8';
import mongoose from 'mongoose';

// register user 
const registerUser = async (req, res) => {
    try {
        const { email, password, userName } = req.body;
        if (!email || !password || !userName) {
            throw "Fields left blank";
        };
        const userExists = await Users.findOne({ email });
        if (userExists) {
            throw "User already exists";
        } else {
            const user = await Users.create({
                email,
                password,
                userName
            });
            if (!user) {
                throw "User could not be created"
            } else {
                const token = getToken(user._id);
                res.status(201).json({
                    success: true,
                    message: "user has been created",
                    token
                });
            };
        };
    } catch (error) {
        console.error(error);
        if (error === "Fields left blank" || "User already exists") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw "Fields left blank";
        };
        const user = await Users.findOne({ email });
        if (user && await user.matchPassword(password)) {
            res.status(200).json({
                success: true,
                message: "User logged in",
                token: getToken(user._id)
            });
        } else {
            throw "Invalid credentials"
        }
    } catch (error) {
        console.error(error);
        if (error === "Fields left blank" || "Invalid credentials") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// update password
const updatePassword = async (req, res) => {
    try {
        const user = await Users.findById(req.user._id);
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            throw "Fields left blank";
        };
        if (!await user.matchPassword(oldPassword)) {
            throw "the passwords don't match";
        } else {
            user.password = newPassword;
            await user.save();
            res.status(200).json({
                success: true,
                message: "Password has been updated"
            });
        };
    } catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// update user profile
const updateProfile = async (req, res) => {
    try {
        const user = await Users.findById(req.user._id);
        const { email, userName } = req.body;
        user.email = email || user.email;
        user.userName = userName || user.userName;
        const updatedUser = await user.save();
        if (!updatedUser) {
            throw "User could not be updated"
        }
        res.status(200).json({
            success: true,
            message: "User profile updated"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

// follow and unfollow user
const followUnfollow = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "invalid post ID";
        };
        const user = await Users.findById(req.user._id);
        const followUser = await Users.findById(req.params.id);
        if (!followUser) {
            throw "user not found";
        };
        if (user.following.includes(req.params.id)) {
            const indexOfFollowing = user.following.indexOf(req.params.id);
            const indexOfFollower = followUser.followers.indexOf(req.user._id);
            user.following.splice(indexOfFollowing, 1);
            followUser.followers.splice(indexOfFollower, 1);
            await user.save();
            await followUser.save();
            res.status(200).json({
                success: true,
                message: "User unfollowed"
            });
        } else {
            user.following.push(req.params.id);
            followUser.followers.push(req.user._id)
            await user.save();
            await followUser.save();
            res.status(200).json({
                success: true,
                message: "User followed"
            });
        }
    } catch (error) {
        console.error(error);
        if (error === "invalid post ID") {
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

// delete user profile
const deleteProfile = async (req, res) => {
    try {
        const user = await Users.findById(req.user._id);
        // remove posts
        for (let i of user.posts) {
            const post = await Posts.findById(i);
            await post.remove();
        };
        //remove followers and followings
        for (let i of user.following) {
            const followingProfile = await Users.findById(i);
            const index = followingProfile.followers.indexOf(req.user._id);
            followingProfile.followers.splice(index, 1);
            if (followingProfile.following.includes(req.user._id)) {
                const index = followingProfile.following.indexOf(req.user._id);
                followingProfile.following.splice(index, 1);
            };
            await followingProfile.save();
        };
        await user.remove();
        res.status(200).json({
            success: true,
            message: "User has been deleted"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    };
};

// get my profile
const myProfile = async (req, res) => {
    try {
        const user = Users.findById(req.user._id);
        const posts = user.populate("posts");
        res.status(200).json({
            success: true,
            posts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    };
};

// get user profile
const getUserProfile = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "Invalid ID";
        };
        const user = await Users.findById(req.params.id);
        if (!user) {
            throw "User not found"
        };
        if (user.posts.length > 0) {
            for (let i of user.posts) {
                const posts = await Posts.findById(i);
                res.status(200).json({
                    success: true,
                    posts
                });
            };
        } else {
            res.status(200).json({
                success: true,
                message: "User has no posts"
            });
        };
    } catch (error) {
        if (error === "Invalid ID") {
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

// generate reset link
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            throw "Kindly enter an email";
        };
        const user = await Users.findOne({ email });
        if (!user) {
            throw "user not found";
        };
        const resetToken = user.getResetPasswordToken();
        await user.save();
        const resetUrl = `${req.protocol}://${req.get("host")}/api/users/password/reset/${resetToken}`;
        const message = `Click on this link to reset your password :${resetUrl}`;
        try {
            await sendEmail({
                email,
                subject: "Reset your password",
                message
            });
            res.status(200).json({
                success: true,
                message: "email sent"
            });
        } catch (error) {
            console.error(error);
            user.resetPasswordToken = undefined;
            user.resetPasswordTokenExpires = undefined;
            await user.save();
            res.status(500).json({
                success: false,
                error: error.message
            });
        };
    } catch (error) {
        if (error === "Kindly enter an email") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// get new password
const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const resetTokenHashed = crypto.createHash("sha256").update(token).digest("hex");
        const user = await Users.findOne({
            resetPasswordToken: resetTokenHashed,
            resetPasswordTokenExpires: { $gt: Date.now() }
        });
        if (!user) {
            throw "Invalid token or expired token";
        };
        const { newPassword } = req.body;
        if (!newPassword) {
            throw "Field left blank";
        };
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save();
        res.status(200).json({
            success: true,
            message: "password has been reset"
        });
    } catch (error) {
        console.error(error);
        if (error === "Invalid token or expired token") {
            res.status(401).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        } else if (error === "Field left blank") {
            res.status(400).json({
                success: false,
                error: error.errors?.[0]?.message || error
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
    deleteProfile,
    myProfile,
    getUserProfile,
    forgetPassword,
    resetPassword
};

