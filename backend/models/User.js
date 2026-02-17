import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Guest User"
    },
    phone: {
      type: String,
      unique: true,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
