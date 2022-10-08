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
            message: "enter all fields"
        });
    } else {
        const user = await Users.findOne({ email });
        if (user) {
            res.status(200);
            res.json({
                success: true,
                message: "user found",
                token: getToken(user._id)
            });
        } else {
            res.status(500);
            res.json({
                success: false,
                message: "user not found"
            });
            throw new Error("user not found");
        };
    };

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
}
);

export {
    registerUser,
    loginUser,
    updateUser
}