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
await connectDB();


const app = express();

/* =========================================================
   BODY PARSER FIRST (IMPORTANT FOR MULTER ON RENDER)
========================================================= */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/* =========================================================
   CORS
========================================================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://www.princyfashionboutique.shop",
  "https://princyfashionboutique.shop"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

/* =========================================================
   ROUTES
========================================================= */
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);

/* TEST ROUTE */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({
    message: err.message || "Internal Server Error"
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);


} catch (error) {
console.log("❌ Server failed to start:", error);
}
};

process.on("unhandledRejection", (err) =>
console.log("Unhandled Rejection:", err)
);
process.on("uncaughtException", (err) =>
console.log("Uncaught Exception:", err)
);

startServer();
