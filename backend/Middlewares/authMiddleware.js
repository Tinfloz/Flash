import jwt from 'jsonwebtoken';
import Users from '../Models/userModel.js';

const protect = async (req, res, next) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Users.findById(decoded.id).select("-password");
            next();
        }
    } catch (error) {
        console.error(error);
        res.status(400);
        res.json({
            success: false,
            message: "Invalid token"
        });
    };
};

export default protect;