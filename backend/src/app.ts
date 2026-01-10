import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";

const app = express();

const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(",").map(origin => origin.trim())
  : ["http://localhost:8081", "http://192.168.1.72:8081"];

console.log("Allowed Origins for CORS:", allowedOrigins);

// Configure CORS properly
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) {
      console.log("No origin header - allowing request");
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log(`Origin ${origin} allowed`);
      return callback(null, true);
    }
    
    // For development, you can also allow any localhost or 192.168.x.x
    if (process.env.NODE_ENV === 'development') {
      const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
      const isLocalNetwork = origin.includes('192.168.');
      const isExpo = origin.includes('exp://');
      
      if (isLocalhost || isLocalNetwork || isExpo) {
        console.log(`Development origin ${origin} allowed`);
        return callback(null, true);
      }
    }
    
    console.log(`Origin ${origin} not allowed by CORS`);
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['set-cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Apply CORS middleware - this handles both regular and OPTIONS requests
app.use(cors(corsOptions));

// IMPORTANT: Remove app.options('*', cors()) - it's not needed!

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

/* 🔥 ROOT ROUTE */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
    cors: allowedOrigins
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    cors: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;