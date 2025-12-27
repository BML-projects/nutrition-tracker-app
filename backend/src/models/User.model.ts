import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  birthday: Date;
  goal: "lose" | "maintain" | "gain";
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, enum: ["male", "female", "other"], required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  birthday: { type: Date, required: true },
  goal: { type: String, enum: ["lose", "maintain", "gain"], required: true },
});

export default model<IUser>("User", userSchema);
