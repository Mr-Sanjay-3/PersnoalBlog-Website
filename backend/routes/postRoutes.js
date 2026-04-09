import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  toggleSavePost,
  unlockPost,
} from '../controllers/postController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getPosts).post(protect, admin, createPost);
router
  .route('/:id')
  .get(getPostById)
  .put(protect, admin, updatePost)
  .delete(protect, admin, deletePost);

router.post('/:id/save', protect, toggleSavePost);
router.post('/:id/unlock', unlockPost);

export default router;
