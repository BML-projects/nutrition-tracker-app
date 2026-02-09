// import { v2 as cloudinary } from "cloudinary";
// import { CloudinaryStorage } from "multer-storage-cloudinary";
// import multer from "multer";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });

// // Configure Cloudinary Storage for Multer
// const storage = new CloudinaryStorage({
//   cloudinary: cloudinary,
//   params: async (req, file) => {
//     return {
//       folder: "nutriscan/profiles",
//       allowed_formats: ["jpg", "jpeg", "png", "webp"],
//       transformation: [
//         { width: 500, height: 500, crop: "fill", gravity: "face" },
//         { quality: "auto" },
//       ],
//       public_id: `user_${(req as any).userId}_${Date.now()}`,
//     };
//   },
// });

// // Create Multer upload middleware
// export const upload = multer({
//   storage: storage,
//   limits: {
//     fileSize: 5 * 1024 * 1024, // 5MB max
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only image files are allowed!"));
//     }
//   },
// });

// // Helper to delete old image from Cloudinary
// export const deleteFromCloudinary = async (imageUrl: string): Promise<void> => {
//   try {
//     if (!imageUrl || !imageUrl.includes("cloudinary.com")) {
//       return;
//     }

//     // Extract public_id from URL
//     const urlParts = imageUrl.split("/");
//     const publicIdWithExtension = urlParts.slice(urlParts.indexOf("nutriscan")).join("/");
//     const publicId = publicIdWithExtension.split(".")[0];

//     await cloudinary.uploader.destroy(publicId);
//     console.log(`🗑️ Deleted old image: ${publicId}`);
//   } catch (error) {
//     console.error("Error deleting from Cloudinary:", error);
//   }
// };

// export default cloudinary;