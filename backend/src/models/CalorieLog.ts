import mongoose, { Schema, Document } from 'mongoose';

export interface ICalorieLog extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  consumed: number;
  burned: number;
  notes?: string;
  meals?: Array<{
    name: string;
    calories: number;
    time: Date;
  }>;
  exercises?: Array<{
    name: string;
    calories: number;
    duration: number;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const CalorieLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    consumed: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    burned: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    notes: {
      type: String,
      maxlength: 1000
    },
    meals: [{
      name: { type: String, required: true },
      calories: { type: Number, required: true, min: 0 },
      time: { type: Date, default: Date.now }
    }],
    exercises: [{
      name: { type: String, required: true },
      calories: { type: Number, required: true, min: 0 },
      duration: { type: Number, required: true, min: 0 } // in minutes
    }]
  },
  {
    timestamps: true
  }
);

// Compound index for efficient queries
CalorieLogSchema.index({ userId: 1, date: -1 });

// Ensure one log per user per day (optional - comment out if you want multiple logs per day)
// CalorieLogSchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model<ICalorieLog>('CalorieLog', CalorieLogSchema);