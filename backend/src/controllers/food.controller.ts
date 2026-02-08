import FormData from "form-data";
import fetch from "node-fetch";
import { Request, Response } from "express";
import { getNutritionFromUSDA } from "./nutritionController";
import { FoodAPIResponse } from "../types/index";

export const predictFood = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname || "food.jpg",
      contentType: req.file.mimetype,
    });

    const fastApiResponse = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    if (!fastApiResponse.ok) {
      const text = await fastApiResponse.text();
      console.error("FastAPI Error:", text);
      return res.status(500).json({ error: "FastAPI prediction failed" });
    }

    const result = (await fastApiResponse.json()) as {
      top1: { class: string; confidence: number };
      top5: { class: string; confidence: number }[];
    };

    const foodName = result?.top1?.class;

    if (!foodName) {
      return res.status(500).json({ error: "No food predicted" });
    }

    const nutrition = await getNutritionFromUSDA(foodName);

    const finalResult: FoodAPIResponse = {
      ...result,
      nutrition: nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 },
    };

    return res.json(finalResult);
  } catch (err: any) {
    console.error("PREDICT FOOD ERROR:", err?.message || err);
    return res.status(500).json({ error: "Prediction failed" });
  }
};
