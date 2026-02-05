import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Admin#@123";

export const adminLogin = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { email, role: "admin" },
    process.env.JWT_ADMIN_SECRET as string,
    { expiresIn: "7d" }
  );

  res.json({ success: true, token });
};
