import express from "express";
import { adminLogin } from "../controllers/adminController";
import { adminProtect } from "../middleware/admin.middleware";

const router = express.Router();

// Public login route
router.post("/login", adminLogin);

// Example protected route
router.get("/dashboard", adminProtect, (_req, res) => {
  res.json({ success: true, message: "Welcome to admin dashboard" });
});

export default router;
