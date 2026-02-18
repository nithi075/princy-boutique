import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* =========================================================
   GET PRODUCTS
   ========================================================= */
export const getProducts = async (req, res) => {
  try {
    const {
      page, limit, category, exclude, price,
      color, size, fabric, work, occasion, fit, featured
    } = req.query;

    let filter = {};

    if (category || exclude) {
      const includeArr = category?.split(",").map(c => decodeURIComponent(c.trim()));
      const excludeArr = exclude?.split(",").map(c => decodeURIComponent(c.trim()));

      if (includeArr && excludeArr) filter.category = { $in: includeArr, $nin: excludeArr };
      else if (includeArr) filter.category = { $in: includeArr };
      else if (excludeArr) filter.category = { $nin: excludeArr };
    }

    if (size) filter.sizes = { $in: [decodeURIComponent(size)] };
    if (color) filter.colors = { $in: [decodeURIComponent(color)] };
    if (fabric) filter.fabric = { $in: fabric.split(",").map(v => decodeURIComponent(v.trim())) };
    if (work) filter.work = { $in: work.split(",").map(v => decodeURIComponent(v.trim())) };
    if (occasion) filter.occasion = { $in: occasion.split(",").map(v => decodeURIComponent(v.trim())) };
    if (fit) filter.fit = { $in: fit.split(",").map(v => decodeURIComponent(v.trim())) };
    if (featured !== undefined) filter.featured = featured === "true";

    let query = Product.find(filter).sort({ createdAt: -1 });
    const totalProducts = await Product.countDocuments(filter);

    if (page && limit) {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);
      const skip = (pageNumber - 1) * limitNumber;

      const products = await query.skip(skip).limit(limitNumber);

      return res.json({
        products,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalProducts / limitNumber),
        totalProducts
      });
    }

    const products = await query;
    res.json({ products, totalProducts, totalPages: 1 });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   CREATE PRODUCT (FIXED CLOUDINARY UPLOAD)
   ========================================================= */
export const createProduct = async (req, res) => {
  try {
    const uploadedImages = [];

    for (const file of req.files) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "princy-boutique/products" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });

      uploadedImages.push(result.secure_url);
    }

    const product = await Product.create({
      ...req.body,
      price: Number(req.body.price),
      readyMade: req.body.readyMade === "true",
      featured: req.body.featured === "true",
      sizes: JSON.parse(req.body.sizes || "[]"),
      colors: JSON.parse(req.body.colors || "[]"),
      images: uploadedImages
    });

    res.status(201).json(product);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   UPDATE PRODUCT
   ========================================================= */
export const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ message: "Product not found" });

    let newImages = existingProduct.images;

    if (req.files?.length) {
      newImages = [];

      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "princy-boutique/products" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );

          streamifier.createReadStream(file.buffer).pipe(stream);
        });

        newImages.push(result.secure_url);
      }
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        price: Number(req.body.price),
        sizes: req.body.sizes ? JSON.parse(req.body.sizes) : existingProduct.sizes,
        colors: req.body.colors ? JSON.parse(req.body.colors) : existingProduct.colors,
        readyMade: req.body.readyMade === "true",
        featured: req.body.featured === "true",
        images: newImages
      },
      { new: true }
    );

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   DELETE PRODUCT
   ========================================================= */
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
