import mongoose, { Schema, Document } from "mongoose";

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
  activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
  profilePhoto?: string;
  resetPasswordOTP?: string;
  resetPasswordOTPExpiry?: Date;
  isBlocked?: boolean; // For admin to block users
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    goal: {
      type: String,
      enum: ["lose", "maintain", "gain"],
      required: true,
    },
    bmi: {
      type: Number,
    },
    bmr: {
      type: Number,
    },
    dailyCalories: {
      type: Number,
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "active", "very_active"],
      default: "moderate",
    },
    profilePhoto: {
      type: String,
      default: "",
    },
    resetPasswordOTP: {
      type: String,
      select: false,
    },
    resetPasswordOTPExpiry: {
      type: Date,
      select: false,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>("User", UserSchema);