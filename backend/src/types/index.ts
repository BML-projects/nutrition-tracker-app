export interface Prediction {
  class: string;
  confidence: number;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodAPIResponse {
  top1: Prediction;
  top5: Prediction[];
  nutrition: Nutrition;
}
