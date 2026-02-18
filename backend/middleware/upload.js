import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,

  // IMPORTANT: params must be a function in production
  params: async (req, file) => {
    return {
      folder: "princy-boutique/products",   // safer folder path
      resource_type: "image",               // ⭐ REQUIRED for Render
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [
        { quality: "auto", fetch_format: "auto" }
      ]
    };
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // prevent 10MB Render limit crash
});

export default upload;
