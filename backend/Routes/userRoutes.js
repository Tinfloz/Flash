import express from 'express';
import { registerUser, loginUser, getUser } from '../Controllers/userController.js';
import protect from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/me').get(protect, getUser);
export default router;