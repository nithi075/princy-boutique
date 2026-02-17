import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();

const startServer = async () => {
  try {
    await connectDB(); // ⭐ WAIT FOR DB CONNECTION

    const app = express();

    /* MIDDLEWARES */
    app.use(cors());
    app.use(express.json());

    /* STATIC IMAGE FOLDER */
    app.use("/uploads", express.static("uploads"));

    /* ROUTES */
    app.use("/api/auth", authRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/wishlist", wishlistRoutes);
    app.use("/api/orders", orderRoutes);
    app.use("/api/contact", contactRoutes);
    app.use("/api/reviews", reviewRoutes);

    /* SERVER */
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

  } catch (error) {
    console.log("Server failed to start:", error);
  }
};

startServer();
