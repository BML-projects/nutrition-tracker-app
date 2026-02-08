import express from 'express';
import { getProfile, updateProfile, uploadProfilePhoto, updateActivityLevel, updateGoal, upload, changePassword } from '../controllers/profile.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes protected
router.get('/', protect, getProfile);
router.patch('/', protect, updateProfile);
router.post(
  '/upload-photo',
  protect,
  upload.fields([{ name: 'photo', maxCount: 1 }]),
  uploadProfilePhoto
);

router.patch('/activity-level', protect, updateActivityLevel);
router.patch('/goal', protect, updateGoal);
router.patch('/change-password', protect, changePassword);

export default router;
