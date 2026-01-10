// Utility functions for health calculations

// Calculate BMI
export const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
export const calculateBMR = (height: number, weight: number, age: number, gender: string): number => {
  if (gender.toLowerCase() === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
};

// Calculate Daily Calories based on BMR and goal
export const calculateDailyCalories = (bmr: number, goal: string, activityLevel: string = 'moderate'): number => {
  // Activity level multipliers
  const activityMultipliers: Record<string, number> = {
    'sedentary': 1.2,      // Little or no exercise
    'light': 1.375,        // Light exercise 1-3 days/week
    'moderate': 1.55,      // Moderate exercise 3-5 days/week
    'active': 1.725,       // Hard exercise 6-7 days/week
    'very_active': 1.9     // Very hard exercise & physical job
  };
  
  const multiplier = activityMultipliers[activityLevel] || 1.55;
  const maintenanceCalories = bmr * multiplier;
  
  // Adjust based on goal
  const goalAdjustments: Record<string, number> = {
    'lose': -500,      // 500 calorie deficit for weight loss (approx 0.5kg/week)
    'maintain': 0,     // No adjustment for maintenance
    'gain': 500        // 500 calorie surplus for weight gain
  };
  
  const adjustment = goalAdjustments[goal] || 0;
  return Math.round(maintenanceCalories + adjustment);
};

// Calculate calories for different goals
export const calculateGoalCalories = (bmr: number, activityLevel: string = 'moderate') => {
  const maintenance = calculateDailyCalories(bmr, 'maintain', activityLevel);
  
  return {
    lose: Math.round(maintenance - 500),      // Weight loss
    maintain: maintenance,                     // Weight maintenance
    gain: Math.round(maintenance + 500)       // Weight gain
  };
};