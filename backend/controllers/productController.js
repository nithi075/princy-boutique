import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

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

    if (price) {
      const ranges = price.split(",");
      const priceConditions = [];

      ranges.forEach(r => {
        if (r === "0-2000") priceConditions.push({ price: { $gte: 0, $lte: 2000 } });
        else if (r === "2000-5000") priceConditions.push({ price: { $gte: 2000, $lte: 5000 } });
        else if (r === "5000-10000") priceConditions.push({ price: { $gte: 5000, $lte: 10000 } });
        else if (r === "10000+") priceConditions.push({ price: { $gte: 10000 } });
      });

      if (priceConditions.length) filter.$and = [{ $or: priceConditions }];
    }

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
   SEARCH PRODUCTS
   ========================================================= */
export const searchProducts = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q || q.length < 2) return res.json([]);

    const products = await Product.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
        { fabric: { $regex: q, $options: "i" } },
        { work: { $regex: q, $options: "i" } },
        { occasion: { $regex: q, $options: "i" } },
        { fit: { $regex: q, $options: "i" } }
      ]
    })
      .select("name price images")
      .limit(8);

    res.json(products);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   GET SINGLE PRODUCT
   ========================================================= */
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   CREATE PRODUCT (Cloudinary)
   ========================================================= */
export const createProduct = async (req, res) => {
  try {
    const imageUrls = req.files?.map(file => file.path) || [];

    const product = await Product.create({
      ...req.body,
      price: Number(req.body.price),
      readyMade: req.body.readyMade === "true",
      featured: req.body.featured === "true",
      sizes: JSON.parse(req.body.sizes || "[]"),
      colors: JSON.parse(req.body.colors || "[]"),
      images: imageUrls
    });

    res.status(201).json(product);

  } catch (err) {
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

    const newImages = req.files?.map(file => file.path);

    // delete old images if new uploaded
    if (newImages?.length && existingProduct.images?.length) {
      for (const img of existingProduct.images) {
        const publicId = img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
    }

    const updatedData = {
      ...req.body,
      price: Number(req.body.price),
      sizes: req.body.sizes ? JSON.parse(req.body.sizes) : existingProduct.sizes,
      colors: req.body.colors ? JSON.parse(req.body.colors) : existingProduct.colors,
      readyMade: req.body.readyMade === "true",
      featured: req.body.featured === "true",
      images: newImages?.length ? newImages : existingProduct.images
    };

    const product = await Product.findByIdAndUpdate(req.params.id, updatedData, { new: true });
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
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.images?.length) {
      for (const img of product.images) {
        const publicId = img.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
