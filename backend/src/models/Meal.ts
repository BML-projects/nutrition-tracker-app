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

const MealSchema = new Schema<IMeal>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    foodName: { 
      type: String, 
      required: true 
    },
    calories: { 
      type: Number, 
      required: true,
      min: 0
    },
    protein: { 
      type: Number, 
      required: true,
      min: 0
    },
    carbs: { 
      type: Number, 
      required: true,
      min: 0
    },
    fat: { 
      type: Number, 
      required: true,
      min: 0
    },
    weight: { 
      type: Number, 
      required: true,
      min: 0
    },
    mealType: { 
      type: String, 
      enum: ["breakfast", "lunch", "dinner", "snack", "dessert"], 
      required: true 
    },
    imageUri: { 
      type: String, 
      default: "" 
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

// Add indexes for better query performance
MealSchema.index({ user: 1, timestamp: -1 });
MealSchema.index({ user: 1, mealType: 1 });
MealSchema.index({ user: 1, createdAt: -1 });

const Meal = mongoose.model<IMeal>("Meal", MealSchema);

export default Meal;