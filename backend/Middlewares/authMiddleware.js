import jwt from 'jsonwebtoken';
import Users from '../Models/userModel.js';
import asyncHandler from 'express-async-handler';

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.user = await Users.findById(decoded.id).select("-password");
            console.log(req.user);
            next();
        } catch (err) {
            console.error(err);
            res.status(401);
            res.json({
                success: false,
                message: "Token failed"
            });
            throw new Error("Token is not valid")
        };
        if (!token) {
            res.status(401);
            throw new Error("No token so not authorized");
        };
    };
});

export default protect