import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { 
  logWeight, 
  getAllWeightLogs, 
  deleteWeightLog 
} from '../controllers/weightLog.controller';
import { 
  getAnalyticsSummary,
  getWeightLogs,
  getCalorieLogs,
  getWeeklyProgress,
  getStreakData,
  getGoalProgress
} from '../controllers/analyticsController';

const router = express.Router();

// ==================== WEIGHT LOGGING ROUTES ====================
router.post('/weight-log', protect, logWeight);
router.get('/weight-logs/all', protect, getAllWeightLogs);
router.delete('/weight-log/:logId', protect, deleteWeightLog);

// ==================== ANALYTICS ROUTES ====================
router.get('/analytics/summary', protect, getAnalyticsSummary);
router.get('/weight-logs', protect, getWeightLogs);
router.get('/calorie-logs', protect, getCalorieLogs);
router.get('/progress/weekly', protect, getWeeklyProgress);
router.get('/progress/streak', protect, getStreakData);
router.get('/progress/goal', protect, getGoalProgress);

export default router;