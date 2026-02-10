import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import User from "../models/User.model";
import { calculateBMI, calculateBMR, calculateDailyCalories } from "../utils/calculations";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import crypto from "crypto";
import nodemailer from "nodemailer";

/* ================= Zod Signup Schema (Enhanced) ================= */
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
  // NEW: Target weight fields (optional)
  targetWeight: z.number().positive().optional(),
  timeline: z.enum(["fast", "moderate", "slow"]).optional(),
  estimatedWeeks: z.number().positive().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[@$!%*?&#]/, "Password must contain at least one special character"),
});

const verifyOTPSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

// Configure your email service
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/* ================= HELPER FUNCTIONS ================= */

// Calculate age from date of birth
const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Calculate weekly weight change rate based on goal and timeline
const calculateWeeklyRate = (goal: string, timeline: string): number => {
  const weeklyRates: Record<string, Record<string, number>> = {
    lose: { fast: 1.0, moderate: 0.5, slow: 0.25 },
    gain: { fast: 0.5, moderate: 0.35, slow: 0.25 },
  };
  
  return weeklyRates[goal]?.[timeline] || 0.5;
};

/* ================= FORGOT PASSWORD ================= */
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    console.log("=== FORGOT PASSWORD REQUEST ===");
    console.log("Request body:", req.body);

    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0].message,
      });
    }

    const { email } = parsed.data;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, an OTP has been sent",
      });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password. Use the OTP below to proceed:</p>
          <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
            ${otp}
          </div>
          <p style="margin-top: 20px;">This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ OTP sent to email:", email);

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error: any) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error sending OTP. Please try again later.",
      error: error.message,
    });
  }
};

/* ================= VERIFY OTP ================= */
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    console.log("=== VERIFY OTP REQUEST ===");

    const parsed = verifyOTPSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0].message,
      });
    }

    const { email, otp } = parsed.data;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    if (new Date() > user.resetPasswordOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    console.log("✅ OTP verified successfully");

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error: any) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};

/* ================= RESET PASSWORD ================= */
export const resetPassword = async (req: Request, res: Response) => {
  try {
    console.log("=== RESET PASSWORD REQUEST ===");

    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0].message,
      });
    }

    const { email, otp, newPassword } = parsed.data;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resetPasswordOTP || user.resetPasswordOTP !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (!user.resetPasswordOTPExpiry || new Date() > user.resetPasswordOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();

    console.log("✅ Password reset successfully for:", email);

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    console.error("RESET PASSWORD ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error resetting password",
      error: error.message,
    });
  }
};

/* ================= CHECK EMAIL EXISTS ================= */
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

/* ================= SIGNUP (ENHANCED WITH TARGET WEIGHT) ================= */
export const signup = async (req: Request, res: Response) => {
  try {
    console.log('=== SIGNUP REQUEST START ===');
    console.log('Request body:', req.body);
    
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log('Validation errors:', parsed.error.issues);
      return res.status(400).json({ 
        success: false,
        errors: parsed.error.issues.map((e) => e.message) 
      });
    }

    const { 
      fullName, 
      email, 
      password, 
      gender, 
      height, 
      weight, 
      dob, 
      goal,
      targetWeight,
      timeline,
      estimatedWeeks
    } = parsed.data;

    console.log('Parsed data:', { 
      fullName, 
      email, 
      gender, 
      height, 
      weight, 
      dob, 
      goal,
      targetWeight,
      timeline,
      estimatedWeeks
    });

    // Check for existing user
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    // Validate target weight if provided
    if (targetWeight) {
      if (goal === 'lose' && targetWeight >= weight) {
        return res.status(400).json({
          success: false,
          message: "Target weight must be less than current weight for weight loss"
        });
      }
      
      if (goal === 'gain' && targetWeight <= weight) {
        return res.status(400).json({
          success: false,
          message: "Target weight must be greater than current weight for weight gain"
        });
      }

      if (targetWeight < 30 || targetWeight > 300) {
        return res.status(400).json({
          success: false,
          message: "Target weight must be between 30 and 300 kg"
        });
      }
    }

    // Validate that target weight is provided for lose/gain goals
    if ((goal === 'lose' || goal === 'gain') && !targetWeight) {
      return res.status(400).json({
        success: false,
        message: `Target weight is required for ${goal} goal`
      });
    }

    console.log('Creating new user...');
    const hashedPassword = await bcrypt.hash(password, 10);

    // Calculate health metrics
    const age = calculateAge(dob);
    const bmi = calculateBMI(height, weight);
    const bmr = calculateBMR(height, weight, age, gender);
    const dailyCalories = calculateDailyCalories(bmr, goal);

    // Calculate target weight plan details
    let weeklyWeightChangeRate: number | undefined;
    let estimatedCompletionDate: Date | undefined;

    if (targetWeight && timeline) {
      weeklyWeightChangeRate = calculateWeeklyRate(goal, timeline);
      
      if (estimatedWeeks) {
        estimatedCompletionDate = new Date();
        estimatedCompletionDate.setDate(estimatedCompletionDate.getDate() + estimatedWeeks * 7);
      }
    }

    // Create user with all fields including initial weight history
    const user = await User.create({
      fullname: fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      gender,
      height,
      weight,
      dob,
      goal,
      bmi,
      bmr,
      dailyCalories,
      // Target weight fields
      targetWeight: targetWeight || undefined,
      timeline: timeline || undefined,
      estimatedWeeks: estimatedWeeks || undefined,
      weeklyWeightChangeRate: weeklyWeightChangeRate || undefined,
      estimatedCompletionDate: estimatedCompletionDate || undefined,
      // Add initial weight to history
      weightHistory: [{
        weight: weight,
        date: new Date(),
        note: 'Initial weight'
      }]
    });

    console.log('User created with ID:', user._id);

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
    
    // Return comprehensive response with fitness plan
    res.status(201).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullname,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        dob: user.dob,
        goal: user.goal,
        bmi: user.bmi,
        bmr: user.bmr,
        dailyCalories: user.dailyCalories,
        targetWeight: user.targetWeight,
        timeline: user.timeline,
        estimatedWeeks: user.estimatedWeeks,
        estimatedCompletionDate: user.estimatedCompletionDate,
      },
      fitnessPlan: {
        currentWeight: weight,
        targetWeight: targetWeight || null,
        goal,
        bmi: Math.round(bmi * 10) / 10,
        bmr: Math.round(bmr),
        dailyCalories,
        timeline: timeline || null,
        estimatedWeeks: estimatedWeeks || null,
        estimatedCompletionDate: estimatedCompletionDate || null,
        weeklyWeightChangeRate: weeklyWeightChangeRate || null,
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
export const login = async (req: Request, res: Response) => {
  try {
    console.log("=== LOGIN REQUEST ===");
    console.log("Request body:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password required" 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    // Set refresh token cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    // Return accessToken + comprehensive user info
    return res.status(200).json({ 
      success: true,
      accessToken,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullname,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        dob: user.dob,
        goal: user.goal,
        bmi: user.bmi,
        bmr: user.bmr,
        dailyCalories: user.dailyCalories,
        targetWeight: user.targetWeight,
        timeline: user.timeline,
        estimatedWeeks: user.estimatedWeeks,
        estimatedCompletionDate: user.estimatedCompletionDate,
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

/* ================= GET CURRENT USER ================= */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    console.log("=== GET CURRENT USER REQUEST ===");
    
    const userId = (req as any).userId;
    
    console.log("User ID from token:", userId);
    
    if (!userId) {
      return res.status(401).json({ 
        success: false,
        message: "User not authenticated" 
      });
    }

    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    console.log("✅ Returning user info for:", userId);

    res.status(200).json({
      success: true,
      userId: userId,
      _id: userId,
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullname,
        gender: user.gender,
        height: user.height,
        weight: user.weight,
        dob: user.dob,
        goal: user.goal,
        bmi: user.bmi,
        bmr: user.bmr,
        dailyCalories: user.dailyCalories,
        targetWeight: user.targetWeight,
        timeline: user.timeline,
        estimatedWeeks: user.estimatedWeeks,
        estimatedCompletionDate: user.estimatedCompletionDate,
        weeklyWeightChangeRate: user.weeklyWeightChangeRate,
      }
    });
  } catch (error: any) {
    console.error("GET CURRENT USER ERROR:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error", 
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