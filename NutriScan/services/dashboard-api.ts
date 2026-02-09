import mealAPI, { SavedMeal } from './meal-api';
import { getProfile } from './profile-api';

export interface DayData {
  date: Date;
  dateNum: string;
  dayName: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
  progress: number; // Percentage of daily goal
  isSelected: boolean;
  isToday: boolean;
}

export interface NutritionSummary {
  caloriesConsumed: number;
  proteinConsumed: number;
  carbsConsumed: number;
  fatConsumed: number;
  dailyCalorieGoal: number;
  dailyProteinGoal: number;
  dailyCarbsGoal: number;
  dailyFatGoal: number;
  calorieProgress: number;
  proteinProgress: number;
  carbsProgress: number;
  fatProgress: number;
  remainingCalories: number;
  aiAnalysis: string;
}

export interface MealActivity {
  id: string;
  foodName: string;
  calories: number;
  mealType: string;
  timestamp: string;
  imageUri: string;
  timeAgo: string;
}

export interface UserInfo {
  fullName: string;
  profilePhoto?: string;
  dailyCalorieGoal: number;
}

export interface DashboardData {
  weekData: DayData[];
  todayNutrition: NutritionSummary;
  recentMeals: MealActivity[];
  weeklyStats: {
    avgCalories: number;
    totalMeals: number;
    bestDay: string;
    streak: number;
  };
  userInfo: UserInfo;
}

class DashboardAPI {
  // Default daily goals (will be overridden by user profile)
  private dailyGoals = {
    calories: 2200,
    protein: 150,
    carbs: 250,
    fat: 70,
  };

  private getTimeAgo(timestamp: string): string {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return past.toLocaleDateString();
  }

  private getStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getEndOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  }

  private getMealsForDate(meals: SavedMeal[], targetDate: Date): SavedMeal[] {
    const start = this.getStartOfDay(targetDate);
    const end = this.getEndOfDay(targetDate);

    return meals.filter(meal => {
      const mealDate = new Date(meal.timestamp);
      return mealDate >= start && mealDate <= end;
    });
  }

  private calculateDayData(meals: SavedMeal[], date: Date, isSelected: boolean, dailyGoal: number): DayData {
    const dayMeals = this.getMealsForDate(meals, date);
    
    const totals = dayMeals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    const progress = Math.min(100, Math.round((totals.calories / dailyGoal) * 100));

    const today = new Date();
    const isToday = this.getStartOfDay(date).getTime() === this.getStartOfDay(today).getTime();

    return {
      date,
      dateNum: date.getDate().toString(),
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
      mealCount: dayMeals.length,
      progress,
      isSelected,
      isToday,
    };
  }

  private generateAIAnalysis(nutrition: NutritionSummary): string {
    const { calorieProgress, remainingCalories, proteinProgress } = nutrition;

    if (calorieProgress >= 100) {
      return "🎯 Great! You've met your calorie goal. Focus on maintaining balance.";
    } else if (calorieProgress >= 80) {
      return `✨ Almost there! ${remainingCalories} cal remaining. A light meal recommended.`;
    } else if (calorieProgress >= 60) {
      return `💪 Good progress! ${remainingCalories} cal left. Keep it balanced.`;
    } else if (calorieProgress >= 40) {
      return `🍽️ You're halfway there! ${remainingCalories} cal remaining for today.`;
    } else if (calorieProgress >= 20) {
      return `📊 Early in the day! ${remainingCalories} cal available. Plan your meals wisely.`;
    } else {
      return `🌅 Day just started! ${remainingCalories} cal to reach your goal.`;
    }
  }

  async getDashboardData(): Promise<DashboardData> {
    try {
      console.log('📊 Fetching dashboard data...');
      
      // Fetch user profile to get real daily goals and name
      let userInfo: UserInfo = {
        fullName: 'User',
        dailyCalorieGoal: this.dailyGoals.calories,
      };

      try {
        const profileResponse = await getProfile();
        if (profileResponse.success && profileResponse.user) {
          userInfo = {
            fullName: profileResponse.user.fullName || 'User',
            profilePhoto: profileResponse.user.profilePhoto,
            dailyCalorieGoal: profileResponse.user.dailyCalories || this.dailyGoals.calories,
          };
          
          // Update daily goals from user profile
          this.dailyGoals.calories = profileResponse.user.dailyCalories || this.dailyGoals.calories;
          
          console.log('👤 User info loaded:', userInfo.fullName, 'Goal:', userInfo.dailyCalorieGoal);
        }
      } catch (profileError) {
        console.warn('⚠️ Could not load user profile, using defaults:', profileError);
      }
      
      // Fetch all meals
      const allMeals = await mealAPI.getMeals();
      console.log(`✅ Fetched ${allMeals.length} total meals`);

      // Generate week data (3 days before, today, 3 days after)
      const today = new Date();
      const weekData: DayData[] = [];

      for (let i = -3; i <= 3; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        const isSelected = i === 0;
        const dayData = this.calculateDayData(allMeals, date, isSelected, userInfo.dailyCalorieGoal);
        weekData.push(dayData);
      }

      // Get today's meals
      const todayMeals = this.getMealsForDate(allMeals, today);
      
      // Calculate today's nutrition
      const todayTotals = todayMeals.reduce(
        (acc, meal) => ({
          calories: acc.calories + (meal.calories || 0),
          protein: acc.protein + (meal.protein || 0),
          carbs: acc.carbs + (meal.carbs || 0),
          fat: acc.fat + (meal.fat || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      const calorieProgress = Math.min(100, Math.round((todayTotals.calories / userInfo.dailyCalorieGoal) * 100));
      const proteinProgress = Math.min(100, Math.round((todayTotals.protein / this.dailyGoals.protein) * 100));
      const carbsProgress = Math.min(100, Math.round((todayTotals.carbs / this.dailyGoals.carbs) * 100));
      const fatProgress = Math.min(100, Math.round((todayTotals.fat / this.dailyGoals.fat) * 100));

      const todayNutrition: NutritionSummary = {
        caloriesConsumed: todayTotals.calories,
        proteinConsumed: todayTotals.protein,
        carbsConsumed: todayTotals.carbs,
        fatConsumed: todayTotals.fat,
        dailyCalorieGoal: userInfo.dailyCalorieGoal,
        dailyProteinGoal: this.dailyGoals.protein,
        dailyCarbsGoal: this.dailyGoals.carbs,
        dailyFatGoal: this.dailyGoals.fat,
        calorieProgress,
        proteinProgress,
        carbsProgress,
        fatProgress,
        remainingCalories: Math.max(0, userInfo.dailyCalorieGoal - todayTotals.calories),
        aiAnalysis: '',
      };

      todayNutrition.aiAnalysis = this.generateAIAnalysis(todayNutrition);

      // Get recent meals (last 5)
      const recentMeals: MealActivity[] = allMeals
        .slice(0, 5)
        .map(meal => ({
          id: meal._id,
          foodName: meal.foodName,
          calories: meal.calories,
          mealType: meal.mealType,
          timestamp: meal.timestamp,
          imageUri: meal.imageUri,
          timeAgo: this.getTimeAgo(meal.timestamp),
        }));

      // Calculate weekly stats
      const weekStart = new Date();
      weekStart.setDate(today.getDate() - 7);
      const weekMeals = allMeals.filter(meal => new Date(meal.timestamp) >= weekStart);
      
      const avgCalories = weekMeals.length > 0
        ? Math.round(weekMeals.reduce((sum, m) => sum + m.calories, 0) / 7)
        : 0;

      // Calculate streak (consecutive days with logged meals)
      let streak = 0;
      for (let i = 0; i >= -30; i--) {
        const checkDate = new Date();
        checkDate.setDate(today.getDate() + i);
        const dayMeals = this.getMealsForDate(allMeals, checkDate);
        if (dayMeals.length > 0) {
          streak++;
        } else if (i < 0) {
          break;
        }
      }

      const weeklyStats = {
        avgCalories,
        totalMeals: weekMeals.length,
        bestDay: weekData.reduce((best, day) => 
          day.totalCalories > best.totalCalories ? day : best
        ).dayName,
        streak,
      };

      console.log('✅ Dashboard data prepared');

      return {
        weekData,
        todayNutrition,
        recentMeals,
        weeklyStats,
        userInfo,
      };
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
      
      // Return empty data structure
      const today = new Date();
      const weekData: DayData[] = [];
      
      for (let i = -3; i <= 3; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        weekData.push({
          date,
          dateNum: date.getDate().toString(),
          dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          mealCount: 0,
          progress: 0,
          isSelected: i === 0,
          isToday: i === 0,
        });
      }

      return {
        weekData,
        todayNutrition: {
          caloriesConsumed: 0,
          proteinConsumed: 0,
          carbsConsumed: 0,
          fatConsumed: 0,
          dailyCalorieGoal: this.dailyGoals.calories,
          dailyProteinGoal: this.dailyGoals.protein,
          dailyCarbsGoal: this.dailyGoals.carbs,
          dailyFatGoal: this.dailyGoals.fat,
          calorieProgress: 0,
          proteinProgress: 0,
          carbsProgress: 0,
          fatProgress: 0,
          remainingCalories: this.dailyGoals.calories,
          aiAnalysis: '🌅 Start tracking your meals to see your progress!',
        },
        recentMeals: [],
        weeklyStats: {
          avgCalories: 0,
          totalMeals: 0,
          bestDay: 'N/A',
          streak: 0,
        },
        userInfo: {
          fullName: 'User',
          dailyCalorieGoal: this.dailyGoals.calories,
        },
      };
    }
  }
}

export default new DashboardAPI();