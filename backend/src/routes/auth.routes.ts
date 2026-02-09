import express from "express";
import {
  signup,
  login,
  refresh,
  logout,
  checkEmailExists,
  forgotPassword,
  verifyOTP,
  resetPassword,
  getCurrentUser,
} from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Existing routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/check-email", checkEmailExists);


// With other routes:
router.get('/auth/me', protect, getCurrentUser);

// New forgot password routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;