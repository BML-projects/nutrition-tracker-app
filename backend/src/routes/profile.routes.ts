import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  uploadProfilePhoto, 
  updateActivityLevel, 
  updateGoal, 
  changePassword,
  updateTargetWeight, // NEW
  upload 
} from '../controllers/profile.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

// All routes protected
router.get('/', protect, getProfile);
router.patch('/', protect, updateProfile);

// Upload profile photo to Cloudinary
// IMPORTANT: Use .single('photo') - Cloudinary storage requires single file
router.post(
  '/upload-photo',
  protect,
  upload.single('photo'),
  uploadProfilePhoto
);

router.patch('/activity-level', protect, updateActivityLevel);
router.patch('/goal', protect, updateGoal);
router.patch('/change-password', protect, changePassword);

// NEW: Update target weight and timeline
router.patch('/target-weight', protect, updateTargetWeight);

export default router;