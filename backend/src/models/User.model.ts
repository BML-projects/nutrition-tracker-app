import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  fullname?: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  height: number;           // in cm
  weight: number;           // in kg
  dob: Date;
  goal: "lose" | "maintain" | "gain";
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

  // Optional calculated fields
  bmi?: number;
  bmr?: number;
  dailyCalories?: number;
}

const userSchema = new Schema<IUser>(
  {  fullname: {
      type: String,
      default: "",
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    dob: { type: Date, required: true },
    goal: { type: String, enum: ["lose", "maintain", "gain"], required: true },
  activityLevel: {
  type: String,
  enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
  default: 'moderate'
},

    // Calculated fields
    bmi: { type: Number },
    bmr: { type: Number },
    dailyCalories: { type: Number },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt
);

export default model<IUser>("User", userSchema);
