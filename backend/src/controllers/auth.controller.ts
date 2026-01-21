import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.model";
import { calculateBMI, calculateBMR, calculateDailyCalories } from "../utils/calculations";
import { generateAccessToken, generateRefreshToken } from "../utils/token";

/* ================= Zod Signup Schema ================= */
const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
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

//check email exists
export const checkEmailExists = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    console.log('📧 [Check Email] Checking email:', email);
    
    if (!email) {
      return res.status(400).json({ 
        success: false,
        message: "Email is required" 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (existingUser) {
      console.log('📧 [Check Email] Email already exists');
      return res.status(409).json({ 
        success: false,
        exists: true,
        message: "Email already registered" 
      });
    }
    
    console.log('📧 [Check Email] Email is available');
    return res.status(200).json({ 
      success: true,
      exists: false,
      message: "Email is available" 
    });
    
  } catch (error: any) {
    console.error('📧 [Check Email] Error:', error);
    res.status(500).json({ 
      success: false,
      message: "Error checking email",
      error: error.message 
    });
  }
};



/* ================= SIGNUP ================= */
export const signup = async (req: Request, res: Response) => {
  try {
    console.log('=== SIGNUP REQUEST START ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('Content-Type header:', req.headers['content-type']);
    console.log('Content-Length:', req.headers['content-length']);
    
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log('Validation errors:', parsed.error.issues);
      return res.status(400).json({ 
        success: false,
        errors: parsed.error.issues.map((e) => e.message) 
      });
    }

    // ✅ Add fullName here
    const { fullName, email, password, gender, height, weight, dob, goal } = parsed.data;

    console.log('Parsed data:', { fullName, email, gender, height, weight, dob, goal });

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    console.log('Creating new user...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Add fullname here
    const user = await User.create({
      fullname: fullName,  // Map fullName to fullname (database field)
      email,
      password: hashedPassword,
      gender,
      height,
      weight,
      dob,
      goal,
    });

    console.log('User created with ID:', user._id);

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

    console.log('Tokens generated');

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log('=== SIGNUP REQUEST COMPLETE ===');
    
    // ✅ Return proper response structure
    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullname,
        bmi: user.bmi,
        bmr: user.bmr,
        dailyCalories: user.dailyCalories
      }
    });
  } catch (error: any) {
    console.error('SIGNUP ERROR:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

/* ================= LOGIN ================= */
/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  try {
    console.log("=== LOGIN REQUEST ===");
    console.log("Request body:", req.body);
    console.log("Request headers:", req.headers);
    console.log("Cookies:", req.cookies);

    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ 
        success: false,
        message: "Email and password required" 
      });
    }

    console.log("Looking for user with email:", email);
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    console.log("User found:", user._id);
    console.log("Stored hashed password exists:", !!user.password);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    console.log("Tokens generated");
    console.log("Setting cookie with refresh token");

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log("Login successful for user:", user._id);

    return res.status(200).json({ 
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullname,
        bmi: user.bmi,
        bmr: user.bmr,
        dailyCalories: user.dailyCalories
      }
    });

  } catch (error: any) {
    console.error("Login error:", error);
    return res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: error.message 
    });
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




