import express from 'express';
import { getProfile, updateActivityLevel, updateGoal } from '../controllers/profile.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// Apply auth to all profile routes
router.use(protect);

// Profile routes
router.get('/', getProfile);
router.patch('/goal', updateGoal);
router.patch('/activity-level', updateActivityLevel);

export default router;