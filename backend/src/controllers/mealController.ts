import { Request, Response } from "express";
import Meal, { IMeal } from "../models/Meal.js";

// Add a meal
export const addMeal = async (req: Request, res: Response) => {
  try {
    const { userId, foodName, calories, protein, carbs, fat, weight, mealType, imageUri } = req.body;

    const newMeal = new Meal({
      user: userId,
      foodName,
      calories,
      protein,
      carbs,
      fat,
      weight,
      mealType,
      imageUri,
      timestamp: new Date(),
    });

    const savedMeal = await newMeal.save();
    res.status(201).json(savedMeal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get meals for a user
export const getMeals = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const meals = await Meal.find({ user: userId }).sort({ timestamp: -1 });
    res.status(200).json(meals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a meal
export const deleteMeal = async (req: Request, res: Response) => {
  try {
    const { mealId } = req.params;
    await Meal.findByIdAndDelete(mealId);
    res.status(200).json({ message: "Meal deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
