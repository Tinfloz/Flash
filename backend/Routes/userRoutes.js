import express from 'express';
import { registerUser, loginUser, updateUser } from '../Controllers/userController.js';
import protect from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/update').put(protect, updateUser);
export default router;