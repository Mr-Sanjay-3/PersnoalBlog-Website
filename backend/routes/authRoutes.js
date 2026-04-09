import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, makeAdmin } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/make-admin/:id', makeAdmin);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;
