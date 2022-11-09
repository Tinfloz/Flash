import express from 'express';
import { registerUser, loginUser, updatePassword, followUnfollow, updateProfile, deleteProfile, myProfile, getUserProfile, forgetPassword, resetPassword, getSearchedUser } from '../Controllers/userController.js';
import protect from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/:id/follow').get(protect, followUnfollow);
router.route('/updatepassword').put(protect, updatePassword);
router.route('/updateprofile').put(protect, updateProfile);
router.route('/deleteprofile').delete(protect, deleteProfile);
router.route('/myprofile').get(protect, myProfile);
// router.route("/:id/userprofile").get(protect, getUserProfile);
router.route("/:name").get(protect, getUserProfile);
router.route("/forget/password").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/").get(protect, getSearchedUser);
export default router;