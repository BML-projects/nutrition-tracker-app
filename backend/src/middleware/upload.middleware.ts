import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Use memory storage for React Native compatibility
const storage = multer.memoryStorage();

// Create Multer upload middleware
export const upload = multer({
  storage: storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
  fileFilter: (_req: any, file: any, cb: any) => {
    console.log("📎 Received file:", file.originalname, file.mimetype);
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"));
    }
  },
});

// Helper to delete old image from Cloudinary
export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
  try {
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
      return;
    }

    // Extract public_id from URL
    const urlParts = imageUrl.split("/");
    const publicIdWithExtension = urlParts
      .slice(urlParts.indexOf("nutriscan"))
      .join("/");
    const publicId = publicIdWithExtension.split(".")[0];

    await cloudinary.uploader.destroy(publicId);
    console.log(`🗑️ Deleted old image: ${publicId}`);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};

export default cloudinary;