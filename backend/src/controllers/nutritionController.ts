import axios from "axios";
import { Nutrition } from "../types";

const USDA_KEY = process.env.USDA_API_KEY;

export const getNutritionFromUSDA = async (foodName: string): Promise<Nutrition | null> => {
  try {
    // 1) Search food
    const searchRes = await axios.post(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_KEY}`,
      {
        query: foodName,
        pageSize: 1,
      }
    );

    const foods = searchRes.data.foods;

    if (!foods || foods.length === 0) return null;

    const fdcId: number = foods[0].fdcId;

    // 2) Get details
    const detailRes = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_KEY}`
    );

    const nutrients = detailRes.data.foodNutrients;

    const findNutrient = (name: string): number => {
      const n = nutrients.find((x: any) => x.nutrient.name === name);
      return n ? n.amount : 0;
    };

    return {
      calories: findNutrient("Energy"),
      protein: findNutrient("Protein"),
      carbs: findNutrient("Carbohydrate, by difference"),
      fat: findNutrient("Total lipid (fat)"),
    };
  } catch (error) {
    console.log("USDA ERROR:", error);
    return null;
  }
};
