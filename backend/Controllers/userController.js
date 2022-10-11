import asyncHandler from 'express-async-handler';
import Users from '../Models/userModel.js';
import getToken from '../Utils/getAccessToken.js';

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, userName } = req.body;
    if (!email || !password || !userName) {
        res.status(400);
        res.json({
            success: false,
            message: "enter all fields"
        });
        throw new Error("enter all fields");
    };
    const userExists = await Users.findOne({ email });
    if (userExists) {
        res.status(400);
        res.json({
            success: false,
            message: "user already exists"
        });
        throw new Error("User already exists")
    } else {
        const user = await Users.create({
            email,
            password,
            userName
        });
        if (user) {
            res.status(201);
            res.json({
                success: true,
                message: "user created",
                token: getToken(user.id)
            });
        } else {
            res.status(500);
            res.json({
                success: false,
                message: "user could not be created"
            });
            throw new Error("User could not be created")
        };
    };

});

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

const updateUser = asyncHandler(async (req, res) => {
    const user = await Users.findById(req.user._id);
    if (!user) {
        res.status(400);
        res.json({
            success: false,
            message: "User not found"
        });
        throw new Error("User not found");
    } else {
        if (req.body.password) {
            user.password = req.body.password
        };
        user.email = req.body.email || user.email;
        user.userName = req.body.userName || user.userName;
        const updatedUser = await user.save();
        res.json({
            success: true,
            message: "User updated",
            token: getToken(updateUser._id)
        });
    };
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await Users.findById(req.user._id);
    if (!user) {
        res.status(500);
        res.json({
            success: false,
            message: "user not found"
        })
        throw new Error("user not found")
    } else {
        await user.remove();
        res.status(200);
        res.json({
            success: true,
            message: "user deleted"
        });
    };
});

const getUser = asyncHandler(async (req, res) => {
    const user = await Users.findById(req.user._id);
    console.log(user)
    if (!user) {
        res.status(500);
        res.json({
            success: false,
            message: "User not found"
        });
    } else {
        res.status(200);
        res.send(user);
    };
});

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

export {
    registerUser,
    loginUser,
    updateUser,
    followUnfollow,
    deleteUser,
    getUser
}