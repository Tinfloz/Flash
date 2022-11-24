import Posts from '../Models/postModel.js';
import Users from '../Models/userModel.js';
import getToken from '../Utils/getAccessToken.js';
import sendEmail from '../Middlewares/resetPassword.js';
import crypto from "crypto";
import mongoose from 'mongoose';

// register user 
const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!userName || !email || !password) {
            throw "empty fields"
        };
        const userExists = await Users.findOne({ email });
        if (userExists) {
            throw "user exists"
        };
        const newUser = await Users.create({
            userName,
            email,
            password
        });
        if (!newUser) {
            throw "user could not be created"
        };
        const sendUser = await Users.findById(newUser._id).select("-password")
        res.status(201).json({
            success: true,
            sendUser,
            token: getToken(newUser._id)
        })
    } catch (error) {
        console.log(error);
        if (error === "empty fields" || "user exists") {
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
            const sendUser = await Users.findOne({ email }).select("-password");
            res.status(200).json({
                success: true,
                sendUser,
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


const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmNewPassword } = req.body;
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            throw "enter all fields"
        };
        const user = await Users.findById(req.user._id);
        if (! await user.matchPassword(oldPassword)) {
            throw "old passwords don't match"
        };
        if (newPassword !== confirmNewPassword) {
            throw "new passwords don't match"
        };
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "password updated"
        })
    } catch (error) {
        res.status(400).json({
            succes: false,
            error: error.errors?.[0]?.message || error
        });
    };
};


// update profiles
const updateProfile = async (req, res) => {
    try {
        const { userName, email } = req.body;
        const user = await Users.findById(req.user._id);
        user.userName = userName || user.userName;
        user.email = email || user.email;
        await user.save();
        res.status(200).json({
            success: true,
            message: "details updated"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
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
        const user = await Users.findById(req.user._id).select("-password");
        const posts = await user.populate("posts");
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

// generate reset link
const forgetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await Users.findOne({
            email
        });
        if (!user) {
            throw "user not found"
        };
        let resetToken = user.getResetPasswordToken();
        await user.save();
        const resetLink = `${req.get("origin")}/reset/password/${resetToken}`;
        let emailToSend = `To reset your password, click on this link: ${resetLink}`
        try {
            await sendEmail({
                email,
                subject: "Reset your password",
                emailToSend
            });
            res.status(200).json({
                success: true,
                message: "email sent"
            })
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordTokenExpires = undefined;
            await user.save();
            res.status(500).json({
                success: false,
                message: "mail could not be sent "
            })
        }
    } catch (error) {
        if (error === "user not found") {
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

// get new password
const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        console.log(token)
        const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await Users.findOne({
            resetPasswordToken,
            resetPasswordTokenExpires: {
                $gt: Date.now()
            }
        });
        if (!user) {
            throw "invalid token or token expired"
        };
        const { newPassword, confirmNewPassword } = req.body;
        if (!newPassword || !confirmNewPassword) {
            throw "fill all fields"
        };
        if (newPassword !== confirmNewPassword) {
            throw "passwords don't match"
        };
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save();
        console.log(user)
        res.status(200).json({
            success: true,
            message: "successfully reset password"
        })
    } catch (error) {
        if (error === "invalid token or token expired" || "passwords don't match" || "fill all fields") {
            res.status(400).json({
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


// get names of searched user in search bar
const getSearchedUser = async (req, res) => {
    try {
        const { name } = req.query;
        let queryTerm = name;
        console.log(name)
        const user = await Users.find({ userName: new RegExp(queryTerm, 'i') });
        res.status(200).json({
            search: user.map(client => {
                return client.userName
            }),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
    };
};

//set user visibility
const setVisibility = async (req, res) => {
    try {
        const { visibility } = req.body;
        const user = await Users.findByIdAndUpdate(req.user._id, { visibility }, { new: true })
        console.log(user)
        await user.save();
        res.status(200).json({
            success: true,
            visibility
        })
    } catch (error) {
        if (error === "you need to select visibility") {
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


// accept request
const acceptRequest = async (req, res) => {
    try {
        const { name } = req.params;
        const user = await Users.findById(req.user._id);
        const toAccept = await Users.findOne({ userName: name })
        if (!toAccept) {
            throw "user not found"
        }
        if (!user.pendingRequests.includes(toAccept._id)) {
            throw "Pending request not found"
        } else {
            const index = user.pendingRequests.indexOf(toAccept._id);
            const toAcceptIndex = toAccept.sentRequests.indexOf(user._id)
            user.pendingRequests.splice(index, 1);
            user.followers.push(toAccept._id);
            toAccept.sentRequests.splice(toAcceptIndex, 1);
            toAccept.following.push(user._id);
            await user.save();
            await toAccept.save();
            res.status(200).json({
                success: true,
                user,
                name: toAccept.userName
            })
        }
    } catch (error) {
        if (error === "invalid id") {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
        if (error === "Pending request not found" || "user not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

//reject request
const rejectRequest = async (req, res) => {
    try {
        const { name } = req.params
        const user = await Users.findById(req.user._id);
        const toReject = await Users.findOne({ userName: name });
        if (!toReject) {
            throw "user not found"
        }
        if (!user.pendingRequests.includes(toReject._id)) {
            throw "Pending request not found"
        } else {
            const index = user.pendingRequests.indexOf(toReject._id);
            const indexToReject = toReject.sentRequests.indexOf(user._id);
            user.pendingRequests.splice(index, 1);
            toReject.sentRequests.splice(indexToReject, 1);
            await user.save();
            await toReject.save();
            res.status(200).json({
                success: true,
                user,
                name: toReject.userName
            });
        };
    } catch (error) {
        if (error === "invalid id") {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
        if (error === "Pending request not found" || "user not found") {
            res.status(404).json({
                success: false,
                error: error.errors?.[0]?.message || error
            });
        };
    };
};

// follow users
const followUnfollow = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            throw "invalid id"
        };
        if (req.user._id === req.params.id) {
            throw "you cannot follow yourself"
        };
        let message;
        const loggedInUser = await Users.findById(req.user._id);
        const user = await Users.findById(req.params.id);
        if (user.visibility === "Private" && !user.followers.includes(loggedInUser._id) &&
            !user.pendingRequests.includes(loggedInUser._id)) {
            console.log("first if")
            user.pendingRequests.push(loggedInUser._id)
            loggedInUser.sentRequests.push(user._id)
            await user.save();
            await loggedInUser.save();
            message = "Request sent"
        } else if (user.visibility === "Public" && !user.followers.includes(req.user._id)) {
            user.followers.push(loggedInUser._id);
            loggedInUser.following.push(user._id);
            await user.save();
            await loggedInUser.save();
            message = "Followed"
        } else if ((user.visibility === "Private" && user.followers.includes(loggedInUser._id)) ||
            user.visibility === "Public" && user.followers.includes(loggedInUser._id)) {
            console.log("third if")
            const index = user.followers.indexOf(loggedInUser._id);
            user.followers.splice(index, 1);
            const indexSent = loggedInUser.following.indexOf(user._id);
            loggedInUser.following.splice(indexSent, 1)
            await user.save();
            await loggedInUser.save();
            message = "Unfollowed"
        } else if ((user.visibility === "Private" && user.pendingRequests.includes(loggedInUser._id))) {
            const index = user.pendingRequests.indexOf(loggedInUser._id);
            const indexSent = loggedInUser.sentRequests.indexOf(user._id);
            user.pendingRequests.splice(index, 1);
            loggedInUser.sentRequests.splice(indexSent, 1);
            await user.save();
            await loggedInUser.save();
            message = "Removed from pending"
        };
        res.status(200).json({
            success: true,
            message,
            sender: loggedInUser._id
        })
    } catch (error) {
        if (error === "invalid id") {
            res.status(500).json({
                success: false,
                error: error.errors?.[0]?.message || error
            })
        } else if (error === "you cannot follow yourself") {
            res.status(400).json({
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

// get all pending follow requests
const getFollowRequests = async (req, res) => {
    try {
        const user = await Users.findById(req.user._id)
            .select("pendingRequests")
            .populate("pendingRequests");
        res.status(200).json({
            success: true,
            requests: user.pendingRequests.map(request => request.userName)
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.errors?.[0]?.message || error
        });
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
    forgetPassword,
    resetPassword,
    getSearchedUser,
    setVisibility,
    acceptRequest,
    rejectRequest,
    getFollowRequests
};


