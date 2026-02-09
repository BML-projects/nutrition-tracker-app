import { Request, Response } from "express";
import Meal, { IMeal } from "../models/Meal"

// Helper function to safely get error messages
const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  return String(error);
};

// ------------------------- Meal Controllers -------------------------

// Add a meal
export const addMeal = async (req: Request, res: Response) => {
  try {
    const { foodName, calories, protein, carbs, fat, weight, mealType, imageUri } = req.body;
    
    // Get userId from the authenticated request (set by auth middleware)
    const userId = (req as any).userId;

    // Validation
    if (!userId) {
      return res.status(401).json({ 
        message: "Unauthorized - User ID not found" 
      });
    }

    if (!foodName || !mealType) {
      return res.status(400).json({ 
        message: "Missing required fields: foodName or mealType" 
      });
    }

    const newMeal = new Meal({
      user: userId,
      foodName,
      calories: calories || 0,
      protein: protein || 0,
      carbs: carbs || 0,
      fat: fat || 0,
      weight: weight || 100,
      mealType,
      imageUri: imageUri || "",
      timestamp: new Date(),
    });

    const savedMeal = await newMeal.save();
    res.status(201).json(savedMeal);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error adding meal:", message);
    res.status(500).json({ message: "Server Error", error: message });
  }
};

// Get meals for a user
export const getMeals = async (req: Request, res: Response) => {
  try {
    const authenticatedUserId = (req as any).userId;

    if (!authenticatedUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const meals = await Meal.find({ user: authenticatedUserId }).sort({ timestamp: -1 });

    res.status(200).json(meals);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error fetching meals:", message);
    res.status(500).json({ message: "Server Error", error: message });
  }
};


// Get a single meal by ID
export const getMealById = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const authenticatedUserId = (req as any).userId;
    
    if (!mealId) return res.status(400).json({ message: "Meal ID is required" });

    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ message: "Meal not found" });

    // Verify the meal belongs to the authenticated user
    if (meal.user.toString() !== authenticatedUserId) {
      return res.status(403).json({ 
        message: "Forbidden - Cannot access other user's meal" 
      });
    }

    res.status(200).json(meal);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error fetching meal:", message);
    res.status(500).json({ message: "Server Error", error: message });
  }
};

// Get meals by date range
export const getMealsByDateRange = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    const authenticatedUserId = (req as any).userId;

    if (userId !== authenticatedUserId) {
      return res.status(403).json({ 
        message: "Forbidden - Cannot access other user's meals" 
      });
    }

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const query: any = { user: userId };
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate as string);
      if (endDate) query.timestamp.$lte = new Date(endDate as string);
    }

    const meals = await Meal.find(query).sort({ timestamp: -1 });
    res.status(200).json(meals);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error fetching meals by date range:", message);
    res.status(500).json({ message: "Server Error", error: message });
  }
};

// Get meals by meal type
export const getMealsByType = async (req: Request, res: Response) => {
  try {
    const { userId, mealType } = req.params;
    const authenticatedUserId = (req as any).userId;

    if (userId !== authenticatedUserId) {
      return res.status(403).json({ 
        message: "Forbidden - Cannot access other user's meals" 
      });
    }

    if (!userId || !mealType) {
      return res.status(400).json({ message: "User ID and meal type are required" });
    }

    const meals = await Meal.find({ user: userId, mealType }).sort({ timestamp: -1 });
    res.status(200).json(meals);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error fetching meals by type:", message);
    res.status(500).json({ message: "Server Error", error: message });
  }
};

// Get daily summary
export const getDailySummary = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    const authenticatedUserId = (req as any).userId;

    if (userId !== authenticatedUserId) {
      return res.status(403).json({ 
        message: "Forbidden - Cannot access other user's data" 
      });
    }

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const targetDate = date ? new Date(date as string) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const meals = await Meal.find({
      user: userId,
      timestamp: { $gte: startOfDay, $lte: endOfDay },
    });

    const summary = meals.reduce(
      (acc, meal) => ({
        totalCalories: acc.totalCalories + (meal.calories || 0),
        totalProtein: acc.totalProtein + (meal.protein || 0),
        totalCarbs: acc.totalCarbs + (meal.carbs || 0),
        totalFat: acc.totalFat + (meal.fat || 0),
        mealCount: acc.mealCount + 1,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0, mealCount: 0 }
    );

    res.status(200).json({ date: targetDate, summary, meals });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error fetching daily summary:", message);
    res.status(500).json({ message: "Server Error", error: message });
  }
};

// Update a meal
export const updateMeal = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const updateData = req.body;
    const authenticatedUserId = (req as any).userId;
    
    if (!mealId) return res.status(400).json({ message: "Meal ID is required" });

    // First check if the meal exists and belongs to the user
    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ message: "Meal not found" });

    if (meal.user.toString() !== authenticatedUserId) {
      return res.status(403).json({ 
        message: "Forbidden - Cannot update other user's meal" 
      });
    }

    const updatedMeal = await Meal.findByIdAndUpdate(mealId, updateData, { new: true, runValidators: true });
    res.status(200).json(updatedMeal);
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error updating meal:", message);
    res.status(500).json({ message: "Server Error", error: message });
  }
};

// Delete a meal
export const deleteMeal = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    const authenticatedUserId = (req as any).userId;
    
    if (!mealId) return res.status(400).json({ message: "Meal ID is required" });

    // First check if the meal exists and belongs to the user
    const meal = await Meal.findById(mealId);
    if (!meal) return res.status(404).json({ message: "Meal not found" });

    if (meal.user.toString() !== authenticatedUserId) {
      return res.status(403).json({ 
        message: "Forbidden - Cannot delete other user's meal" 
      });
    }

    const deletedMeal = await Meal.findByIdAndDelete(mealId);
    res.status(200).json({ message: "Meal deleted successfully", deletedMeal });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error deleting meal:", message);
    res.status(500).json({ message: "Server Error", error: message });
  }
};

// Delete all meals for a user
export const deleteAllMeals = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = (req as any).userId;

    if (userId !== authenticatedUserId) {
      return res.status(403).json({ 
        message: "Forbidden - Cannot delete other user's meals" 
      });
    }

    if (!userId) return res.status(400).json({ message: "User ID is required" });

    const result = await Meal.deleteMany({ user: userId });
    res.status(200).json({ message: "All meals deleted successfully", deletedCount: result.deletedCount });
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error("Error deleting all meals:", message);
    res.status(500).json({ message: "Server Error", error: message });
  }
};