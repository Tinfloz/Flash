import express from 'express';
import { registerUser, loginUser, updatePassword, followUnfollow, updateProfile, deleteProfile, myProfile, forgetPassword, resetPassword, getSearchedUser, setVisibility, acceptRequest, rejectRequest, getFollowRequests } from '../Controllers/userController.js';
import protect from '../Middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.route('/:id/follow').get(protect, followUnfollow);
router.route('/updatepassword').post(protect, updatePassword);
router.route('/updateprofile').post(protect, updateProfile);
router.route('/deleteprofile').delete(protect, deleteProfile);
router.route('/myprofile').get(protect, myProfile);
router.route("/forget/password").post(forgetPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/").get(protect, getSearchedUser);
router.route("/visibility").post(protect, setVisibility);
router.route("/:name/accept").get(protect, acceptRequest);
router.route("/:name/reject").get(protect, rejectRequest);
router.route("/get/requests").get(protect, getFollowRequests);
export default router;