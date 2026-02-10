// Enhanced utility functions for health calculations

// Calculate BMI
export const calculateBMI = (height: number, weight: number): number => {
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// Get BMI category and recommendations
export const getBMICategory = (bmi: number) => {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: '#3b82f6',
      recommendation: 'gain',
      message: 'Your BMI indicates you are underweight. We recommend focusing on healthy weight gain.'
    };
  }
  if (bmi < 25) {
    return {
      category: 'Normal',
      color: '#10b981',
      recommendation: 'maintain',
      message: 'Your BMI is in the healthy range. You can maintain or adjust based on your preferences.'
    };
  }
  if (bmi < 30) {
    return {
      category: 'Overweight',
      color: '#f59e0b',
      recommendation: 'lose',
      message: 'Your BMI indicates you are overweight. We recommend focusing on healthy weight loss.'
    };
  }
  return {
    category: 'Obese',
    color: '#ef4444',
    recommendation: 'lose',
    message: 'Your BMI indicates obesity. We strongly recommend focusing on weight loss with professional guidance.'
  };
};

// Calculate age from DOB
export const calculateAge = (dob: string | Date): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
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
export const calculateDailyCalories = (
  bmr: number, 
  goal: string, 
  activityLevel: string = 'moderate'
): number => {
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

// Validate goal based on BMI
export interface GoalValidation {
  isValid: boolean;
  warning?: string;
  suggestion?: string;
  suggestedGoal?: 'lose' | 'maintain' | 'gain';
}

export const validateGoalWithBMI = (
  bmi: number, 
  goal: 'lose' | 'maintain' | 'gain'
): GoalValidation => {
  const bmiInfo = getBMICategory(bmi);
  
  // Underweight trying to lose
  if (bmi < 18.5 && goal === 'lose') {
    return {
      isValid: false,
      warning: '⚠️ Health Warning',
      suggestion: 'Your BMI indicates you are underweight. Losing more weight could be harmful to your health. We strongly recommend focusing on gaining weight instead.',
      suggestedGoal: 'gain'
    };
  }
  
  // Obese trying to gain
  if (bmi >= 30 && goal === 'gain') {
    return {
      isValid: false,
      warning: '⚠️ Health Warning',
      suggestion: 'Your BMI indicates obesity. Gaining more weight could increase health risks. We strongly recommend focusing on losing weight instead.',
      suggestedGoal: 'lose'
    };
  }
  
  // Overweight trying to gain
  if (bmi >= 25 && bmi < 30 && goal === 'gain') {
    return {
      isValid: true,
      warning: '⚠️ Consider This',
      suggestion: 'Your BMI indicates you are overweight. While you can gain weight, consider if weight loss might be healthier for you.',
      suggestedGoal: 'lose'
    };
  }
  
  // Underweight trying to maintain
  if (bmi < 18.5 && goal === 'maintain') {
    return {
      isValid: true,
      warning: '💡 Suggestion',
      suggestion: 'Your BMI indicates you are underweight. Consider gaining weight to reach a healthier range.',
      suggestedGoal: 'gain'
    };
  }
  
  return { isValid: true };
};

// Calculate target weight plan
export interface WeightPlan {
  targetWeight: number;
  currentWeight: number;
  weightDifference: number;
  timeline: 'fast' | 'moderate' | 'slow';
  weeklyRate: number; // kg per week
  estimatedWeeks: number;
  estimatedCompletionDate: string;
  dailyCalorieAdjustment: number;
  dailyCalories: number;
  warnings: string[];
  recommendations: string[];
}

export const calculateWeightPlan = (
  currentWeight: number,
  targetWeight: number,
  goal: 'lose' | 'gain',
  timeline: 'fast' | 'moderate' | 'slow',
  bmr: number,
  activityLevel: string = 'moderate'
): WeightPlan => {
  const weightDifference = Math.abs(targetWeight - currentWeight);
  const warnings: string[] = [];
  const recommendations: string[] = [];
  
  // Safe weekly rates (kg/week) based on research and health guidelines
  const weeklyRates: Record<'lose' | 'gain', Record<'fast' | 'moderate' | 'slow', number>> = {
    lose: {
      fast: 1.0,      // 1kg/week - maximum safe rate
      moderate: 0.5,  // 0.5kg/week - recommended rate
      slow: 0.25      // 0.25kg/week - gentle rate
    },
    gain: {
      fast: 0.5,      // 0.5kg/week - moderate rate for muscle gain
      moderate: 0.35, // 0.35kg/week - recommended rate
      slow: 0.25      // 0.25kg/week - slow, lean gains
    }
  };
  
  const weeklyRate = weeklyRates[goal][timeline];
  const estimatedWeeks = Math.ceil(weightDifference / weeklyRate);
  
  // Calculate estimated completion date
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + estimatedWeeks * 7);
  const estimatedCompletionDate = completionDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  
  // Calculate daily calorie adjustment
  // 1 kg of body weight ≈ 7700 calories
  const totalCaloriesNeeded = weightDifference * 7700;
  const dailyAdjustment = Math.round(totalCaloriesNeeded / (estimatedWeeks * 7));
  
  // Calculate maintenance calories
  const activityMultipliers: Record<string, number> = {
    'sedentary': 1.2,
    'light': 1.375,
    'moderate': 1.55,
    'active': 1.725,
    'very_active': 1.9
  };
  const maintenanceCalories = bmr * (activityMultipliers[activityLevel] || 1.55);
  
  // Calculate target daily calories
  let dailyCalories: number;
  if (goal === 'lose') {
    dailyCalories = Math.round(maintenanceCalories - dailyAdjustment);
  } else {
    dailyCalories = Math.round(maintenanceCalories + dailyAdjustment);
  }
  
  // Add warnings and recommendations
  if (goal === 'lose' && dailyCalories < 1200) {
    warnings.push('⚠️ Your plan results in very low daily calories (below 1200). This may not be safe or sustainable.');
    warnings.push('Consider choosing a slower timeline or consulting with a healthcare provider.');
    dailyCalories = 1200; // Set minimum safe calories
  }
  
  if (goal === 'lose' && timeline === 'fast') {
    warnings.push('⚠️ Fast weight loss can lead to muscle loss and nutritional deficiencies.');
    recommendations.push('💡 Consider a moderate pace for sustainable results.');
  }
  
  if (goal === 'gain' && timeline === 'fast') {
    recommendations.push('💡 Fast weight gain may include more fat gain. Moderate pace is better for lean muscle.');
  }
  
  if (weightDifference > 20) {
    recommendations.push('💡 This is a significant weight change. Consider breaking it into smaller milestones.');
    recommendations.push('💡 Consult with a healthcare provider or nutritionist for personalized guidance.');
  }
  
  if (estimatedWeeks > 52) {
    recommendations.push('💡 This is a long-term goal (over 1 year). Stay consistent and celebrate small wins!');
  }
  
  return {
    targetWeight,
    currentWeight,
    weightDifference,
    timeline,
    weeklyRate,
    estimatedWeeks,
    estimatedCompletionDate,
    dailyCalorieAdjustment: dailyAdjustment,
    dailyCalories,
    warnings,
    recommendations
  };
};

// Get ideal weight range based on height
export const getIdealWeightRange = (height: number): { min: number; max: number } => {
  // Using BMI 18.5-24.9 as healthy range
  const heightInMeters = height / 100;
  const minWeight = Math.round(18.5 * heightInMeters * heightInMeters);
  const maxWeight = Math.round(24.9 * heightInMeters * heightInMeters);
  
  return { min: minWeight, max: maxWeight };
};