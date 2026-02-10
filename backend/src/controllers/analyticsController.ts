import { Request, Response } from 'express';
import User from '../models/User.model';
import WeightLog from '../models/WeightLog';
import Meal from '../models/Meal';

interface AuthRequest extends Request {
  userId?: string;
}

// ==================== HELPER FUNCTIONS ====================

function getDateRangeForAnalytics(range: '7days' | '30days' | '90days') {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  
  switch(range) {
    case '7days':
      start.setDate(start.getDate() - 6);
      break;
    case '30days':
      start.setDate(start.getDate() - 29);
      break;
    case '90days':
      start.setDate(start.getDate() - 89);
      break;
    default:
      start.setDate(start.getDate() - 6);
  }
  
  return { start, end };
}

function formatChartDateLabel(date: Date, range: string): string {
  if (range === '90days') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else if (range === '30days') {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  }
}

function createFullDateArray(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

// ==================== MAIN ANALYTICS ENDPOINT ====================
export async function getAnalyticsSummary(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    console.log('📊 [getAnalyticsSummary] Starting for user:', userId);
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'User not authenticated'
      });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    console.log('📊 [User]:', user.fullname);

    // ==================== FETCH ALL MEALS ====================
    // CRITICAL: Your Meal model uses 'user' field, not 'userId'
    const allMeals = await Meal.find({ 
      user: userId 
    }).sort({ timestamp: 1 });
    
    console.log('📊 [Total meals]:', allMeals.length);
    if (allMeals.length > 0) {
      console.log('📊 [Sample meal]:', {
        food: allMeals[0].foodName,
        cal: allMeals[0].calories,
        time: allMeals[0].timestamp
      });
    }

    // ==================== PROCESS WEIGHT LOGS ====================
    async function processWeightData(range: '7days' | '30days' | '90days') {
      const { start, end } = getDateRangeForAnalytics(range);
      
      const weightLogs = await WeightLog.find({
        userId,
        date: { $gte: start, $lte: end }
      }).sort({ date: 1 });

      console.log(`📊 [Weight ${range}]:`, weightLogs.length, 'logs');

      if (weightLogs.length === 0) {
        return { labels: [], values: [] };
      }

      const allDates = createFullDateArray(start, end);
      const labels: string[] = [];
      const values: number[] = [];

      const logMap = new Map<string, number>();
      weightLogs.forEach(log => {
        const dateKey = new Date(log.date).toISOString().split('T')[0];
        logMap.set(dateKey, log.weight);
      });

      let lastWeight = user?.weight || 0;
      
      allDates.forEach(date => {
        const dateKey = date.toISOString().split('T')[0];
        
        if (logMap.has(dateKey)) {
          lastWeight = logMap.get(dateKey)!;
        }
        
        labels.push(formatChartDateLabel(date, range));
        values.push(lastWeight);
      });

      return { labels, values };
    }

    // ==================== PROCESS CALORIE DATA ====================
    async function processCalorieData(range: '7days' | '30days' | '90days') {
      const { start, end } = getDateRangeForAnalytics(range);
      
      console.log(`📊 [Calorie ${range}] Range:`, { start, end });
      
      const mealsInRange = allMeals.filter(meal => {
        const mealDate = new Date(meal.timestamp);
        return mealDate >= start && mealDate <= end;
      });

      console.log(`📊 [Calorie ${range}] Meals:`, mealsInRange.length);

      if (mealsInRange.length === 0) {
        return { labels: [], values: [] };
      }

      const allDates = createFullDateArray(start, end);
      const labels: string[] = [];
      const values: number[] = [];

      const caloriesByDate = new Map<string, number>();
      
      mealsInRange.forEach(meal => {
        const mealDate = new Date(meal.timestamp);
        const dateKey = mealDate.toISOString().split('T')[0];
        
        const current = caloriesByDate.get(dateKey) || 0;
        caloriesByDate.set(dateKey, current + (meal.calories || 0));
      });

      console.log(`📊 [Calorie ${range}] By date:`, Object.fromEntries(caloriesByDate));

      const dailyGoal = user?.dailyCalories || 2000;
      
      allDates.forEach(date => {
        const dateKey = date.toISOString().split('T')[0];
        const consumed = caloriesByDate.get(dateKey) || 0;
        const net = consumed - dailyGoal;
        
        labels.push(formatChartDateLabel(date, range));
        values.push(Math.round(net));
      });

      console.log(`📊 [Calorie ${range}] Chart:`, { labelCount: labels.length, valueCount: values.length });

      return { labels, values };
    }

    // Process all time ranges
    const [w7, w30, w90, c7, c30, c90] = await Promise.all([
      processWeightData('7days'),
      processWeightData('30days'),
      processWeightData('90days'),
      processCalorieData('7days'),
      processCalorieData('30days'),
      processCalorieData('90days')
    ]);

    const weightLogData = {
      ranges: ['7 days', '30 days', '90 days'],
      data: {
        '7 days': w7,
        '30 days': w30,
        '90 days': w90
      }
    };

    const netCaloriesData = {
      ranges: ['7 days', '30 days', '90 days'],
      data: {
        '7 days': c7,
        '30 days': c30,
        '90 days': c90
      }
    };

    // ==================== WEEKLY PROGRESS ====================
    const { start: weekStart, end: weekEnd } = getDateRangeForAnalytics('7days');
    
    const weekMeals = allMeals.filter(meal => {
      const mealDate = new Date(meal.timestamp);
      return mealDate >= weekStart && mealDate <= weekEnd;
    });

    console.log('📊 [Week meals]:', weekMeals.length);

    let totalConsumed = 0;
    const dailyMap = new Map<string, { consumed: number; burned: number }>();
    
    weekMeals.forEach(meal => {
      const mealDate = new Date(meal.timestamp);
      const dateKey = mealDate.toISOString().split('T')[0];
      
      const current = dailyMap.get(dateKey) || { consumed: 0, burned: 0 };
      current.consumed += meal.calories || 0;
      dailyMap.set(dateKey, current);
      
      totalConsumed += meal.calories || 0;
    });

    const allWeekDates = createFullDateArray(weekStart, weekEnd);
    const dailyBreakdown = allWeekDates.map(date => {
      const dateKey = date.toISOString().split('T')[0];
      const data = dailyMap.get(dateKey) || { consumed: 0, burned: 0 };
      
      return {
        date: formatChartDateLabel(date, '7days'),
        consumed: data.consumed,
        burned: data.burned,
        net: data.consumed - data.burned
      };
    });

    const weeklyGoal = (user.dailyCalories || 2000) * 7;
    const totalBurned = 0;
    const weeklyNet = totalConsumed - totalBurned;

    const weeklyProgress = {
      dateRange: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      goal: weeklyGoal,
      consumed: totalConsumed,
      burned: totalBurned,
      net: weeklyNet,
      remaining: weeklyGoal - weeklyNet,
      dailyBreakdown
    };

    // ==================== STREAK CALCULATION ====================
    const uniqueDates = new Set<string>();
    allMeals.forEach(meal => {
      const dateKey = new Date(meal.timestamp).toISOString().split('T')[0];
      uniqueDates.add(dateKey);
    });

    const sortedDates = Array.from(uniqueDates).sort().reverse();
    
    console.log('📊 [Unique dates]:', sortedDates.slice(0, 5));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (sortedDates.length > 0) {
      for (let i = 0; i < sortedDates.length; i++) {
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        const expectedKey = expectedDate.toISOString().split('T')[0];

        if (sortedDates[i] === expectedKey) {
          currentStreak++;
        } else {
          break;
        }
      }

      let lastDate: Date | null = null;
      for (const dateStr of sortedDates.reverse()) {
        const currentDate = new Date(dateStr);
        
        if (!lastDate) {
          tempStreak = 1;
        } else {
          const daysDiff = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === 1) {
            tempStreak++;
          } else {
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 1;
          }
        }
        
        lastDate = currentDate;
      }
      longestStreak = Math.max(longestStreak, tempStreak);
    }

    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const recentDates = sortedDates.filter(dateStr => {
      const date = new Date(dateStr);
      return date >= fourWeeksAgo;
    });

    const weeklyGoalsMet = Math.min(4, Math.floor(recentDates.length / 5));

    const streakData = {
      current: currentStreak,
      longest: longestStreak,
      weeklyGoalsMet
    };

    console.log('📊 [Streak]:', streakData);

    // ==================== GOAL PROGRESS ====================
    const latestWeightLog = await WeightLog.findOne({ userId }).sort({ date: -1 });
    const currentWeight = latestWeightLog ? latestWeightLog.weight : user.weight;

    let goalProgress = 0;
    let goalStatus = 'No target weight set';
    let remaining = 0;

    if (user.targetWeight) {
      const startWeight = user.weight;
      const targetWeight = user.targetWeight;
      const totalToChange = Math.abs(startWeight - targetWeight);
      const currentProgress = Math.abs(startWeight - currentWeight);

      goalProgress = totalToChange > 0 ? Math.min(100, Math.round((currentProgress / totalToChange) * 100)) : 0;
      remaining = Math.abs(currentWeight - targetWeight);

      if (user.goal === 'lose') {
        if (currentWeight <= targetWeight) {
          goalStatus = '🎉 Goal achieved!';
        } else if (goalProgress >= 75) {
          goalStatus = '🔥 Almost there!';
        } else if (goalProgress >= 50) {
          goalStatus = '💪 Halfway there!';
        } else if (goalProgress >= 25) {
          goalStatus = '🌟 Good start!';
        } else {
          goalStatus = `📈 ${goalProgress}% of the way to your goal!`;
        }
      } else if (user.goal === 'gain') {
        goalStatus = currentWeight >= targetWeight ? '🎉 Goal achieved!' : `📈 ${goalProgress}% of the way!`;
      }
    }

    const goalProgressData = {
      goalStatus,
      goalProgress,
      targetWeight: user.targetWeight || 0,
      currentWeight,
      remaining
    };

    // ==================== WEIGHT CHANGE ====================
    const weights7 = w7.values;
    let weightChange = {
      value: 0,
      trend: 'stable' as 'up' | 'down' | 'stable'
    };

    if (weights7.length >= 2) {
      const first = weights7[0];
      const last = weights7[weights7.length - 1];
      const change = last - first;
      
      weightChange = {
        value: parseFloat(Math.abs(change).toFixed(1)),
        trend: change > 0.1 ? 'up' : change < -0.1 ? 'down' : 'stable'
      };
    }

    // ==================== AVG CALORIES ====================
    const avgDailyCalories = totalConsumed > 0 && dailyBreakdown.length > 0
      ? Math.round(totalConsumed / dailyBreakdown.filter(d => d.consumed > 0).length)
      : user.dailyCalories || 2000;

    console.log('📊 [FINAL]:', {
      meals: allMeals.length,
      cal7d: c7.values.length,
      weight7d: w7.values.length,
      streak: currentStreak,
      consumed: totalConsumed
    });

    res.json({
      success: true,
      weightLog: weightLogData,
      netCalories: netCaloriesData,
      goalProgress: goalProgressData,
      weeklyProgress,
      streakData,
      avgDailyCalories,
      weightChange
    });

  } catch (error: any) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      details: error.message
    });
  }
}

// ==================== OTHER ENDPOINTS ====================
export async function getWeightLogs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const range = (req.query.range as '7days' | '30days' | '90days') || '7days';
    const { start, end } = getDateRangeForAnalytics(range);

    const logs = await WeightLog.find({
      userId,
      date: { $gte: start, $lte: end }
    }).sort({ date: 1 });

    const labels: string[] = [];
    const values: number[] = [];

    logs.forEach(log => {
      labels.push(formatChartDateLabel(log.date, range));
      values.push(log.weight);
    });

    res.json({
      success: true,
      data: { [range]: { labels, values } }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getCalorieLogs(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const range = (req.query.range as '7days' | '30days' | '90days') || '7days';
    const { start, end } = getDateRangeForAnalytics(range);

    const meals = await Meal.find({
      user: userId,
      timestamp: { $gte: start, $lte: end }
    }).sort({ timestamp: 1 });

    const labels: string[] = [];
    const values: number[] = [];

    const caloriesByDate = new Map<string, number>();
    meals.forEach(meal => {
      const dateKey = new Date(meal.timestamp).toISOString().split('T')[0];
      const current = caloriesByDate.get(dateKey) || 0;
      caloriesByDate.set(dateKey, current + (meal.calories || 0));
    });

    const allDates = createFullDateArray(start, end);
    allDates.forEach(date => {
      const dateKey = date.toISOString().split('T')[0];
      labels.push(formatChartDateLabel(date, range));
      values.push(caloriesByDate.get(dateKey) || 0);
    });

    res.json({
      success: true,
      data: { [range]: { labels, values } }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getWeeklyProgress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const { start, end } = getDateRangeForAnalytics('7days');
    
    const meals = await Meal.find({
      user: userId,
      timestamp: { $gte: start, $lte: end }
    });

    const totalConsumed = meals.reduce((sum, meal) => sum + (meal.calories || 0), 0);
    const user = await User.findById(userId);
    const weeklyGoal = ((user?.dailyCalories || 2000) * 7);

    res.json({
      success: true,
      dateRange: `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`,
      goal: weeklyGoal,
      consumed: totalConsumed,
      burned: 0,
      net: totalConsumed,
      remaining: weeklyGoal - totalConsumed
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getStreakData(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const meals = await Meal.find({ user: userId }).sort({ timestamp: -1 });
    
    const uniqueDates = new Set<string>();
    meals.forEach(meal => {
      uniqueDates.add(new Date(meal.timestamp).toISOString().split('T')[0]);
    });

    const sortedDates = Array.from(uniqueDates).sort().reverse();
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      if (sortedDates[i] === expected.toISOString().split('T')[0]) {
        currentStreak++;
      } else {
        break;
      }
    }

    res.json({
      success: true,
      current: currentStreak,
      longest: currentStreak,
      weeklyGoalsMet: 0
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export async function getGoalProgress(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Not authenticated' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    const latestWeight = await WeightLog.findOne({ userId }).sort({ date: -1 });
    const currentWeight = latestWeight?.weight || user.weight;

    res.json({
      success: true,
      goalStatus: 'Keep going!',
      goalProgress: 0,
      targetWeight: user.targetWeight || 0,
      currentWeight,
      remaining: Math.abs((user.targetWeight || 0) - currentWeight)
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
}