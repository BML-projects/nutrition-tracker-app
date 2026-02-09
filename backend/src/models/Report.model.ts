import mongoose, { Document, Schema } from "mongoose";

export interface IReport extends Document {
  user: mongoose.Types.ObjectId;
  type: "wrong_nutrition" | "wrong_recognition" | "bug" | "other";
  description: string;
  foodName?: string;
  imageUri?: string;
  status: "pending" | "solved" | "spam";
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<IReport>(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    type: { 
      type: String, 
      enum: ["wrong_nutrition", "wrong_recognition", "bug", "other"], 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    foodName: { 
      type: String 
    },
    imageUri: { 
      type: String 
    },
    status: { 
      type: String, 
      enum: ["pending", "solved", "spam"], 
      default: "pending" 
    },
    timestamp: { 
      type: Date, 
      default: Date.now 
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReport>("Report", reportSchema);