import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
  clearCart
} from "../controllers/cartController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* USER CART */
router.get("/", protect, getCart);
router.post("/", protect, addToCart);

/* SPECIAL ROUTES FIRST */
router.delete("/clear", protect, clearCart);

/* PARAM ROUTES LAST */
router.put("/:id", protect, updateCart);
router.delete("/:id", protect, removeFromCart);

export default router;
