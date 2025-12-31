
import { Router } from "express";
import {
  signup,
  login,
  refresh,
  logout,
  checkEmailExists,
} from "../controllers/auth.controller";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/check-email", checkEmailExists);

export default router;
