import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

  /* BASIC INFO */
  name: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  description: {
    type: String,
    default: "",
    trim: true
  },

  /* FILTER FIELDS (IMPORTANT FOR SHOP PAGE) */

  fabric: {
    type: String,
    default: ""
  },

  work: {
    type: String,
    default: ""
  },

  occasion: {
    type: String,
    default: ""
  },

  fit: {                      // ⭐ NEW (used in filters)
    type: String,
    default: ""
  },

  readyMade: {
    type: Boolean,
    default: false
  },

  featured: {
    type: Boolean,
    default: false
  },

  /* VARIANTS */

  sizes: {
    type: [String],          // Example: ["S","M","L"]
    default: []
  },

  colors: {
    type: [String],          // Example: ["Red","Blue","Gold"]
    default: []
  },

  customNote: {
    type: String,
    default: ""
  },

  /* IMAGES */

  images: {
    type: [String],
    default: []
  }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);
