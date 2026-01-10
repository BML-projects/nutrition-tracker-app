import { Request, Response } from 'express';
import User from '../models/User.model';
import {
      calculateBMI,
      calculateBMR,
      calculateDailyCalories,
      calculateGoalCalories
} from '../utils/calculations';

// Get user profile
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

// Update activity level
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

// Update goal with calorie recalculation
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