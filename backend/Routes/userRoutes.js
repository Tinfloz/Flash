import express from 'express';
import { registerUser, loginUser, updateUser, deleteUser } from '../Controllers/userController.js';
import protect from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/update').put(protect, updateUser);
router.route('/delete').delete(protect, deleteUser)
export default router;