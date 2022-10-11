import express from 'express';
import { registerUser, loginUser, updateUser, deleteUser, getUser, followUnfollow } from '../Controllers/userController.js';
import protect from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/update').put(protect, updateUser);
router.route('/:id/follow').put(protect, followUnfollow);
router.route('/delete').delete(protect, deleteUser);
router.route('/getuser').get(protect, getUser)
export default router;