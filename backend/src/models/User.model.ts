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
  
  // Target weight tracking fields
  targetWeight?: number;
  timeline?: "fast" | "moderate" | "slow";
  estimatedWeeks?: number;
  estimatedCompletionDate?: Date;
  weeklyWeightChangeRate?: number; // kg per week
  
  // Weight history for tracking progress
  weightHistory?: Array<{
    weight: number;
    date: Date;
    note?: string;
  }>;
  
  resetPasswordOTP?: string;
  resetPasswordOTPExpiry?: Date;
  isBlocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
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
      min: 50, // minimum 50cm
      max: 300, // maximum 300cm
    },
    weight: {
      type: Number,
      required: true,
      min: 20, // minimum 20kg
      max: 500, // maximum 500kg
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
    
    // Target weight tracking
    targetWeight: {
      type: Number,
      min: 30,
      max: 300,
    },
    timeline: {
      type: String,
      enum: ["fast", "moderate", "slow"],
    },
    estimatedWeeks: {
      type: Number,
      min: 1,
      max: 260, // approximately 5 years
    },
    estimatedCompletionDate: {
      type: Date,
    },
    weeklyWeightChangeRate: {
      type: Number, // kg per week
    },
    
    // Weight history for progress tracking
    weightHistory: {
      type: [
        {
          weight: {
            type: Number,
            required: true,
          },
          date: {
            type: Date,
            default: Date.now,
          },
          note: {
            type: String,
          },
        },
      ],
      default: [],
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

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ goal: 1 });

// Create the model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;