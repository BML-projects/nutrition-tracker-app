import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.model";
import { calculateBMI, calculateBMR, calculateDailyCalories } from "../utils/calculations";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

/* ================= Zod Signup Schema ================= */
const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
  gender: z.enum(["male", "female", "other"]),
  height: z.number().positive(),
  weight: z.number().positive(),
  dob: z.coerce.date(),
  goal: z.enum(["lose", "maintain", "gain"]),
});

/* ================= SIGNUP ================= */
export const signup = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ errors: parsed.error.issues.map((e) => e.message) });
    }

    const { email, password, gender, height, weight, dob, goal } =
      parsed.data;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user WITHOUT bmi/bmr/dailyCalories first
    const user = await User.create({
      email,
      password: hashedPassword,
      gender,
      height,
      weight,
      dob,
      goal,
    });


    // Calculate BMI, BMR, dailyCalories
    const bmi = calculateBMI(height, weight);
    const birthYear = dob.getFullYear();
    const age = new Date().getFullYear() - birthYear;
    const bmr = calculateBMR(height, weight, age, gender);
    const dailyCalories = calculateDailyCalories(bmr, goal);

    // Update user document
    user.bmi = bmi;
    user.bmr = bmr;
    user.dailyCalories = dailyCalories;
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      accessToken,
      bmi: user.bmi,
      bmr: user.bmr,
      dailyCalories: user.dailyCalories
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ accessToken });

  } catch (error: any) {
    return res.status(500).json({ message: "Internal server error" });
  }
};


/* ================= REFRESH ================= */
export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.sendStatus(401);

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;

    const accessToken = generateAccessToken(payload.userId);
    res.json({ accessToken });
  } catch {
    res.sendStatus(403);
  }
};

/* ================= LOGOUT ================= */
export const logout = async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.sendStatus(204);
};


//check email exists
export const checkEmailExists = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(409).json({ message: "Email already exists" });
    }

    return res.status(200).json({ message: "Email available" });

  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

