export interface DateRange {
  start: Date;
  end: Date;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface DailyBreakdown {
  date: string;
  consumed: number;
  burned: number;
  net: number;
}

export interface WeeklyProgressResponse {
  success: boolean;
  dateRange: string;
  goal: number;
  consumed: number;
  burned: number;
  net: number;
  remaining: number;
  dailyBreakdown: DailyBreakdown[];
}

export interface StreakDataResponse {
  success: boolean;
  current: number;
  longest: number;
  weeklyGoalsMet: number;
}

export interface GoalProgressResponse {
  success: boolean;
  goalStatus: string;
  goalProgress: number;
  targetWeight: number;
  currentWeight: number;
  remaining: number;
}

export interface WeightChangeData {
  value: number;
  trend: 'up' | 'down' | 'stable';
}

export interface AnalyticsSummaryResponse {
  success: boolean;
  weightLog: {
    ranges: string[];
    data: {
      '7 days': ChartData;
      '30 days': ChartData;
      '90 days': ChartData;
    };
  };
  netCalories: {
    ranges: string[];
    data: {
      '7 days': ChartData;
      '30 days': ChartData;
      '90 days': ChartData;
    };
  };
  goalProgress: Omit<GoalProgressResponse, 'success'>;
  weeklyProgress: Omit<WeeklyProgressResponse, 'success'>;
  streakData: Omit<StreakDataResponse, 'success'>;
  avgDailyCalories: number;
  weightChange: WeightChangeData;
}