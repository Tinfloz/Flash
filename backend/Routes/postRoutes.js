import express from 'express';
import { getPosts, setPosts, deletePosts, updatePosts } from '../Controllers/postController.js';
const router = express.Router();

router.route('/').post(setPosts).get(getPosts);
router.route('/:id').put(updatePosts).delete(deletePosts);

export default router;