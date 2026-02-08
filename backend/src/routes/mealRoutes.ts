import express from "express";
import { addMeal, getMeals, deleteMeal } from "../controllers/mealController.js";

const router = express.Router();

// Add meal
router.post("/", addMeal);

// Get all meals for a user
router.get("/:userId", getMeals);

// Delete meal
router.delete("/:mealId", deleteMeal);

export default router;
