import express from 'express';
import { getPosts, setPosts, deletePosts } from '../Controllers/postController.js';
const router = express.Router();

router.route('/').post(setPosts).get(getPosts);
router.route('/:id').delete(deletePosts);

export default router;