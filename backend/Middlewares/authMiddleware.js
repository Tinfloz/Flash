import jwt from 'jsonwebtoken';
import Users from '../Models/userModel.js';
import asyncHandler from 'express-async-handler';

const protect = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        res.status(400);
        res.json({
            success: false,
            message: "Token not found"
        })
    } else {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Users.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            console.error(error);
            res.status(400);
            res.json({
                success: false,
                message: "Invalid Token"
            });
        };
    }
}

export default protect;