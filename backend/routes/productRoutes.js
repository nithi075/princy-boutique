import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from "../controllers/productController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

/* ================= SEARCH ================= */
router.get("/search", searchProducts);

/* ================= GET ================= */
router.get("/", getProducts);
router.get("/:id", getProductById);

/* ================= CREATE =================
   Cloudinary upload (max 5 images)
*/
router.post(
  "/",
  upload.array("images", 5),
  createProduct
);

/* ================= UPDATE =================
   If images sent -> replace old images
*/
router.put(
  "/:id",
  upload.array("images", 5),
  updateProduct
);

/* ================= DELETE ================= */
router.delete("/:id", deleteProduct);

export default router;
