import { Request, Response } from 'express';
import User from '../models/User.model';
import bcrypt from 'bcryptjs';
import {
  calculateBMI,
  calculateBMR,
  calculateDailyCalories,
  calculateGoalCalories
} from '../utils/calculations';
import { upload, deleteFromCloudinary } from '../middleware/upload.middleware';

// ==================== UPDATE PROFILE DETAILS ====================
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ success: false, error: 'Unauthorized' });

    // Accept both 'fullname' and 'fullName' for compatibility
    const { fullname, fullName, gender, height, weight, dob } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    // Update fields if provided
    if (fullname || fullName) user.fullname = fullname || fullName;
    if (gender) user.gender = gender;
    if (height) user.height = Number(height);
    if (weight) user.weight = Number(weight);
    if (dob) user.dob = new Date(dob);

    // Recalculate BMI & BMR
    const birthYear = user.dob.getFullYear();
    const age = new Date().getFullYear() - birthYear;

    user.bmi = calculateBMI(user.height, user.weight);
    user.bmr = calculateBMR(user.height, user.weight, age, user.gender);
    user.dailyCalories = calculateDailyCalories(user.bmr, user.goal, user.activityLevel || 'moderate');

    await user.save();

    res.json({ success: true, user });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ success: false, error: 'Server error', message: error.message });
  }
};

// ==================== UPLOAD PROFILE PHOTO TO CLOUDINARY ====================
export const uploadProfilePhoto = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Check for file - Cloudinary storage uses req.file
    const file = req.file;
    if (!file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Delete old profile photo from Cloudinary if exists
    if (user.profilePhoto) {
      await deleteFromCloudinary(user.profilePhoto);
    }

    // Save Cloudinary URL (file.path contains the Cloudinary URL)
    user.profilePhoto = file.path;
    await user.save();

    console.log('📸 Profile photo uploaded to Cloudinary:', user.profilePhoto);

    res.json({ 
      success: true, 
      profilePhoto: user.profilePhoto,
      message: 'Profile photo uploaded successfully'
    });
  } catch (error: any) {
    console.error('Upload profile photo error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error',
      message: error.message 
    });
  }
};

// ==================== CHANGE PASSWORD ====================
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { currentPassword, newPassword } = req.body;

    console.log('🔐 [Change Password] Starting for user:', userId);

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        error: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        success: false, 
        error: 'New password must be at least 6 characters long' 
      });
    }

    // Find user with password field
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    console.log('🔐 [Change Password] Success for user:', userId);

    res.json({ 
      success: true, 
      message: 'Password changed successfully' 
    });
  } catch (error: any) {
    console.error('🔐 [Change Password] Error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error', 
      message: error.message 
    });
  }
};

// ==================== GET PROFILE ====================
export const getProfile = async (req: Request, res: Response) => {
  try {
    console.log('👤 [Get Profile] Starting...');
    
    const userId = (req as any).userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Calculate age from DOB
    const birthYear = user.dob.getFullYear();
    const age = new Date().getFullYear() - birthYear;
    
    // Calculate BMI if not already calculated
    if (!user.bmi || user.bmi === 0) {
      user.bmi = calculateBMI(user.height, user.weight);
    }
    
    // Calculate BMR if not already calculated
    if (!user.bmr || user.bmr === 0) {
      user.bmr = calculateBMR(user.height, user.weight, age, user.gender);
    }
    
    // Calculate daily calories if not already calculated
    if (!user.dailyCalories || user.dailyCalories === 0) {
      user.dailyCalories = calculateDailyCalories(
        user.bmr, 
        user.goal || 'maintain',
        user.activityLevel || 'moderate'
      );
    }
    
    // Save updated calculations
    await user.save();

    // Calculate calories for all goals (to show in frontend)
    const allGoalCalories = calculateGoalCalories(user.bmr, user.activityLevel || 'moderate');
    
    const response = {
      success: true,
      user: {        
        id: user._id,
        fullName: user.fullname,
        email: user.email,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        dob: user.dob.toISOString().split('T')[0],
        goal: user.goal,
        bmi: user.bmi,
        bmr: user.bmr,
        dailyCalories: user.dailyCalories,
        activityLevel: user.activityLevel || 'moderate',
        profilePhoto: user.profilePhoto, // Cloudinary URL
      },
      goalCalories: allGoalCalories
    };

    console.log('👤 [Get Profile] Sending response');
    res.json(response);
  } catch (error: any) {
    console.error('👤 [Get Profile] Error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// ==================== UPDATE ACTIVITY LEVEL ====================
export const updateActivityLevel = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { activityLevel } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const validLevels = ['sedentary', 'light', 'moderate', 'active', 'very_active'];
    if (!activityLevel || !validLevels.includes(activityLevel)) {
      return res.status(400).json({ error: 'Invalid activity level' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update activity level
    user.activityLevel = activityLevel;
    
    // Recalculate calories with new activity level
    const birthYear = user.dob.getFullYear();
    const age = new Date().getFullYear() - birthYear;
    user.bmr = calculateBMR(user.height, user.weight, age, user.gender);
    user.dailyCalories = calculateDailyCalories(user.bmr, user.goal, activityLevel);
    
    // Calculate all goal calories
    const allGoalCalories = calculateGoalCalories(user.bmr, activityLevel);
    
    await user.save();

    res.json({
      success: true,
      message: 'Activity level updated',
      activityLevel: user.activityLevel,
      dailyCalories: user.dailyCalories,
      goalCalories: allGoalCalories,
      explanation: `Updated to ${activityLevel} activity level. Your daily calories adjusted accordingly.`
    });
  } catch (error: any) {
    console.error('Update activity level error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// ==================== UPDATE GOAL ====================
export const updateGoal = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { goal } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!goal || !['lose', 'maintain', 'gain'].includes(goal)) {
      return res.status(400).json({ error: 'Invalid goal value' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Store old goal for comparison
    const oldGoal = user.goal;
    
    // Update goal
    user.goal = goal;
    
    // Calculate age
    const birthYear = user.dob.getFullYear();
    const age = new Date().getFullYear() - birthYear;
    
    // Recalculate BMR and BMI (if needed)
    if (!user.bmi || user.bmi === 0) {
      user.bmi = calculateBMI(user.height, user.weight);
    }
    
    if (!user.bmr || user.bmr === 0) {
      user.bmr = calculateBMR(user.height, user.weight, age, user.gender);
    }
    
    // Calculate NEW daily calories based on new goal
    user.dailyCalories = calculateDailyCalories(
      user.bmr, 
      goal, 
      user.activityLevel || 'moderate'
    );
    
    // Calculate calories for all goals
    const allGoalCalories = calculateGoalCalories(user.bmr, user.activityLevel || 'moderate');
    
    await user.save();

    res.json({
      success: true,
      message: 'Goal updated successfully',
      oldGoal,
      newGoal: goal,
      bmi: user.bmi,
      bmr: user.bmr,
      dailyCalories: user.dailyCalories,
      goalCalories: allGoalCalories,
      explanation: getGoalExplanation(goal, user.dailyCalories)
    });
  } catch (error: any) {
    console.error('Update goal error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Server error',
      message: error.message 
    });
  }
};

// Helper function to explain the goal
const getGoalExplanation = (goal: string, calories: number) => {
  const explanations: Record<string, string> = {
    'lose': `To lose weight, aim for ${calories.toLocaleString()} calories per day. This creates a calorie deficit for gradual weight loss.`,
    'maintain': `To maintain your weight, aim for ${calories.toLocaleString()} calories per day. This matches your energy expenditure.`,
    'gain': `To gain weight, aim for ${calories.toLocaleString()} calories per day. This creates a calorie surplus for muscle gain.`
  };
  return explanations[goal] || 'Goal updated successfully.';
};

// Export upload middleware
export { upload };