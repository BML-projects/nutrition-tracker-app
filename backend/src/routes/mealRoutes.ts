import express from 'express';
import {
  addMeal,
  getMeals,
  getMealById,
  getMealsByDateRange,
  getMealsByType,
  getDailySummary,
  updateMeal,
  deleteMeal,
  deleteAllMeals,
} from '../controllers/mealController';

// Import your existing auth middleware
import { protect } from '../middleware/auth.middleware';

// Import multer for image upload
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Create a meal (with optional image upload)
router.post('/meals', upload.single('image'), addMeal);

// Get all meals for a user
router.get("/meals", getMeals);

// Get a specific meal by ID
router.get('/meals/detail/:mealId', getMealById);

// Get meals by date range
router.get('/meals/:userId/range', getMealsByDateRange);

// Get meals by type
router.get('/meals/:userId/type/:mealType', getMealsByType);

// Get daily summary
router.get('/meals/:userId/summary', getDailySummary);

// Update a meal (with optional image upload)
router.put('/meals/:mealId', upload.single('image'), updateMeal);

// Delete a meal
router.delete('/meals/:mealId', deleteMeal);

// Delete all meals for a user
router.delete('/meals/all/:userId', deleteAllMeals);

export default router;