import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  stars: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
