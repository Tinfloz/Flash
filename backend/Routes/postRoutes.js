import express from 'express';
import { setPosts, likeUnlikePosts, deletePosts, getPosts, updateCaption } from '../Controllers/postController.js';
import protect from '../Middlewares/authMiddleware.js'
const router = express.Router();

router.route('/').post(protect, setPosts);
router.route("/:id/likestatus").put(protect, likeUnlikePosts)
router.route("/:id/delete").delete(protect, deletePosts)
router.route('/posts').get(protect, getPosts);
router.route('/:id/updatecaption').put(protect, updateCaption);
// router.route('/:id').delete(deletePosts);

export default router;