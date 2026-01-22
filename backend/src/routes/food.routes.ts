import express from "express";
import multer from "multer";
import { predictFood } from "../controllers/food.controller";

const router = express.Router();
const upload = multer();

router.post("/predict", upload.single("file"), predictFood);

export default router;
