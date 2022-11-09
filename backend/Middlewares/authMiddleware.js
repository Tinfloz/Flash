import jwt from 'jsonwebtoken';
import Users from '../Models/userModel.js';

const protect = async (req, res, next) => {
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Users.findById(decoded.id).select("-password");
            if (!req.user) {
                throw "User does not exist"
            }
            next();
        }
    } catch (error) {
        console.error(error);
        if (error === "User does not exist") {
            res.status(404).json({
                success: false,
                message: error.errors?.[0]?.message || error
            });
        } else {
            res.status(500).json({
                success: false,
                message: error.errors?.[0]?.message || error
            });
        };
    };
};

export default protect;