import mongoose, { Document, Schema } from "mongoose";

export interface IMeal extends Document {
  user: mongoose.Types.ObjectId; // reference to User
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weight: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack" | "dessert";
  imageUri?: string;
  timestamp: Date;
}

const mealSchema = new Schema<IMeal>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    foodName: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    weight: { type: Number, required: true },
    mealType: { 
      type: String, 
      enum: ["breakfast", "lunch", "dinner", "snack", "dessert"], 
      required: true 
    },
    imageUri: { type: String, default: "" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IMeal>("Meal", mealSchema);
