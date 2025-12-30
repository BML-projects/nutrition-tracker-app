import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import { errorHandler, notFound } from "./middleware/error.middleware";

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Nutrition Tracker Backend is running!');
});

app.use("/api/auth", authRoutes);

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
