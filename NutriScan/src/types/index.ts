export type Ingredient = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Prediction = {
  class: string;
  confidence: number;
  nutrition?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};