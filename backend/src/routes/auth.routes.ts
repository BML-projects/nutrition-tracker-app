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
} from "../controllers/auth.controller";

const router = express.Router();

// Existing routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/check-email", checkEmailExists);

// New forgot password routes
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOTP);
router.post("/reset-password", resetPassword);

export default router;