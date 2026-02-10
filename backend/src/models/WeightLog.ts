import mongoose, { Schema, Document } from 'mongoose';

export interface IWeightLog extends Document {
  userId: mongoose.Types.ObjectId;
  weight: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WeightLogSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    weight: {
      type: Number,
      required: true,
      min: 20,
      max: 300
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true
    },
    notes: {
      type: String,
      maxlength: 500
    }
    
  },
  {
    timestamps: true
  }
);

// Compound index for efficient queries
WeightLogSchema.index({ userId: 1, date: -1 });

export default mongoose.model<IWeightLog>('WeightLog', WeightLogSchema);