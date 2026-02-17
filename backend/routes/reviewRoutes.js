import express from "express";
import {
  getReviews,
  addReview,
  deleteReview,
} from "../controllers/reviewController.js";

const router = express.Router();

/* GET */
router.get("/", getReviews);

/* POST */
router.post("/", addReview);

/* DELETE */
router.delete("/:id", deleteReview);

export default router;
