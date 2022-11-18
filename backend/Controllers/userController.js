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
// const followUnfollow = async (req, res) => {
//     try {
//         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//             throw "invalid user ID";
//         };
//         const user = await Users.findById(req.user._id);
//         const followUser = await Users.findById(req.params.id);
//         if (!followUser) {
//             throw "user not found";
//         };
//         if (user.following.includes(req.params.id)) {
//             const indexOfFollowing = user.following.indexOf(req.params.id);
//             const indexOfFollower = followUser.followers.indexOf(req.user._id);
//             user.following.splice(indexOfFollowing, 1);
//             followUser.followers.splice(indexOfFollower, 1);
//             await user.save();
//             await followUser.save();
//             res.status(200).json({
//                 success: true,
//                 message: "User unfollowed"
//             });
//         } else {
//             user.following.push(req.params.id);
//             followUser.followers.push(req.user._id)
//             await user.save();
//             await followUser.save();
//             res.status(200).json({
//                 success: true,
//                 message: "User followed"
//             });
//         }
//     } catch (error) {
//         console.error(error);
//         if (error === "invalid post ID") {
//             res.status(400).json({
//                 success: false,
//                 error: error.errors?.[0]?.message || error
//             });
//         } else {
//             res.status(404).json({
//                 success: false,
//                 error: error.errors?.[0]?.message || error
//             });

//         };
//     };
// };

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

// get user profile
// const followUnfollow = async (req, res) => {
//     try {
//         if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//             throw "user id invalid"
//         };
//         const toBeFollowed = await Users.findById(req.params.id);
//         if (!toBeFollowed) {
//             throw "user not found"
//         };
//         const user = await Users.findById(req.user._id);
//         if (req.user._id.toString() === req.params.id.toString()) {
//             throw "you cannot follow yourself"
//         };
//         if (toBeFollowed.followers.includes(req.user._id)) {
//             const indexUser = toBeFollowed.followers.indexOf(req.user._id);
//             const indexToBeFollowed = user.following.indexOf(req.params.id);
//             toBeFollowed.followers.splice(indexUser, 1);
//             user.following.splice(indexToBeFollowed, 1)
//             await toBeFollowed.save();
//             await user.save();
//             res.status(200).json({
//                 success: true,
//                 message: "user unfollowed",
//                 userId: user._id
//             });
//         } else {
//             toBeFollowed.followers.push(req.user._id);
//             user.following.push(req.params.id);
//             await toBeFollowed.save();
//             await user.save();
//             res.status(200).json({
//                 success: true,
//                 message: "user followed",
//                 userId: user._id
//             })
//         }
//     } catch (error) {
//         console.log(error);
//         if (error === "user id invalid") {
//             res.status(400).json({
//                 success: false,
//                 error: error.errors?.[0]?.message || error
//             })
//         } else if (error === "user not found") {
//             res.status(404).json({
//                 success: false,
//                 error: error.errors?.[0]?.message || error
//             })
//         } else {
//             res.status(400).json({
//                 success: false,
//                 error: error.errors?.[0]?.message || error
//             });
//         };
//     };
// };


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
        console.log(visibility);
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
                toAccept
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
                toReject
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




