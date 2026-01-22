import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  dob: Date;
  goal: "lose" | "maintain" | "gain";
  bmi?: number;
  bmr?: number;
  dailyCalories?: number;
  resetPasswordOTP?: string;
  resetPasswordOTPExpiry?: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    gender: { type: String, enum: ["male", "female", "other"], required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    dob: { type: Date, required: true },
    goal: { type: String, enum: ["lose", "maintain", "gain"], required: true },
    bmi: { type: Number },
    bmr: { type: Number },
    dailyCalories: { type: Number },
    resetPasswordOTP: { type: String, select: false },
    resetPasswordOTPExpiry: { type: Date, select: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", userSchema);