import asyncHandler from "express-async-handler";
import getToken from "../Utils/getAccessToken.js";
import Users from "../Models/userModel.js";

const registerUser = asyncHandler(async (req, res) => {
    const { email, password, userName } = req.body;

    if (!email || !password || !userName) {
        res.status(400);
        res.json({
            success: false,
            message: "fill all fields"
        })
        throw new Error("Fill all fields")
    };

    const user = await Users.findOne({ email });
    if (user) {
        res.status(400);
        res.json({
            success: false,
            message: "user already exists"
        });
        throw new Error("User already exists")
    };

    const createUser = await Users.create({
        email,
        password,
        userName
    });

    if (createUser) {
        res.status(201);
        res.json({
            success: true,
            message: "user created",
            token: getToken(createUser._id)
        });
    } else {
        res.status(400);
        res.json({
            success: false,
            message: "user could not be created"
        });
        throw new Error("user could not be created")
    };
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (user && await user.matchPassword(password)) {
        res.status(200);
        res.json({
            success: true,
            token: getToken(user._id)
        });
    } else {
        res.status(400);
        res.json({
            success: false,
            message: "invalid credentials"
        });
        throw new Error("invalid credentials");
    };
});

const getUser = asyncHandler(async (req, res) => {

})

export {
    registerUser,
    loginUser
}