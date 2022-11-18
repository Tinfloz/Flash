import express from 'express';
import { setPosts, likeUnlikePosts, deletePosts, updateCaption, addComment, deleteComment, getPosts, getLoggedInPosts, getSearchedUserPosts, editComment } from '../Controllers/postController.js';
import protect from '../Middlewares/authMiddleware.js'
const router = express.Router();

router.route('/').post(protect, setPosts);
router.route("/:id/likestatus").get(protect, likeUnlikePosts)
router.route("/:id/delete").delete(protect, deletePosts)
router.route('/posts').get(protect, getPosts);
router.route('/:id/updatecaption').put(protect, updateCaption);
router.route("/:id/comment").post(protect, addComment);
router.route("/:post/:comment/delete/comment").get(protect, deleteComment);
router.route("/get/posts").get(protect, getLoggedInPosts);
router.route("/:name/profile").get(protect, getSearchedUserPosts);
router.route("/:id/:comment/edit").post(protect, editComment);

export default router;