import express from "express";
import {
  adminLogin,
  getDashboardStats,
  getMostScannedFoods,
  getRecentMeals,
  getUsers,
  blockUser,
  deleteUser,
  deleteMeal,
  getRecognitionLogs,
  overrideMapping,
  getReports,
  updateReportStatus,
  deleteReport,
  getAnalytics,
} from "../controllers/adminController";
import { authenticateAdmin } from "../middleware/admin.middleware";

const router = express.Router();

// Public routes (no authentication needed)
router.post("/login", adminLogin);

// Protected routes (require admin authentication)
router.use(authenticateAdmin); // All routes below require authentication

// Dashboard stats
router.get("/stats", getDashboardStats);
router.get("/most-scanned-foods", getMostScannedFoods);
router.get("/recent-meals", getRecentMeals);
router.get("/analytics", getAnalytics);

// User management
router.get("/users", getUsers);
router.patch("/users/:userId/block", blockUser);
router.delete("/users/:userId", deleteUser);

// Meal management
router.delete("/meals/:mealId", deleteMeal);

// Recognition logs
router.get("/recognition-logs", getRecognitionLogs);
router.patch("/recognition-logs/:logId/override", overrideMapping);

// Reports management
router.get("/reports", getReports);
router.patch("/reports/:reportId/status", updateReportStatus);
router.delete("/reports/:reportId", deleteReport);

export default router;