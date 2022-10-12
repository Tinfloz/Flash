import express from 'express';
import { registerUser, loginUser, updatePassword, followUnfollow, logoutUser, updateProfile, deleteProfile, myProfile } from '../Controllers/userController.js';
import protect from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/:id/follow').put(protect, followUnfollow);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/updateprofile').put(protect, updateProfile);
router.route('/logout').get(logoutUser);
router.route('/deleteprofile').delete(protect, deleteProfile);
router.route('/myprofile').get(protect, myProfile);
export default router;