import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import adminRoutes from "./routes/adminRoutes";
import { errorHandler, notFound } from "./middleware/error.middleware";
import path from "path/win32";
import foodRoutes from "./routes/food.routes";
import mealRoutes from "./routes/mealRoutes";


dotenv.config();

const app = express();

// ================== CORS SETUP ==================
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return callback(null, true);

    // Allow localhost + local IPs
    if (
      origin.includes("localhost") ||
      origin.includes("127.0.0.1") ||
      origin.includes("192.168.") ||
      origin.includes("10.") ||
      origin.includes("172.")
    ) {
      return callback(null, true);
    }

    // Allow Expo domains (Expo Go / Expo web)
    if (origin.includes("exp.direct") || origin.includes("expo.dev")) {
      return callback(null, true);
    }

    // Allow ngrok frontend calls
    if (origin.includes("ngrok-free.dev")) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"), false);
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// ✅ Preflight FIRST (Express 5 fix)
app.options(/.*/, cors(corsOptions));

// ✅ Apply CORS
app.use(cors(corsOptions));

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================== ROOT & HEALTH ==================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

app.get("/ping", (req, res) => {
  res.json({ success: true, message: "pong" });
});

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ================== ROUTES ==================
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/admin", adminRoutes);
app.use("/api/food", foodRoutes);
app.use('/api', mealRoutes);  

// ================== ERROR HANDLING ==================
app.use(notFound);
app.use(errorHandler);

export default app;
