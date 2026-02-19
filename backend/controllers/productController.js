import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

/* =========================================================
SAFE JSON PARSER (IMPORTANT FIX)
========================================================= */
const safeJSON = (value, defaultValue = []) => {
try {
if (!value) return defaultValue;
if (Array.isArray(value)) return value;
if (typeof value === "object") return Object.values(value);
return JSON.parse(value);
} catch {
return defaultValue;
}
};

/* =========================================================
CLOUDINARY UPLOAD (RENDER SAFE)
========================================================= */
const uploadToCloudinary = (file) => {
return new Promise((resolve, reject) => {


const stream = cloudinary.uploader.upload_stream(
  {
    folder: "products",
    resource_type: "image",
    timeout: 60000
  },
  (error, result) => {
    if (error) {
      console.error("CLOUDINARY ERROR:", error);
      return reject(error);
    }
    resolve(result.secure_url);
  }
);

const readable = new Readable();
readable.push(file.buffer);
readable.push(null);
readable.pipe(stream);


});
};

/* =========================================================
GET PRODUCTS
========================================================= */
/* =========================================================
GET PRODUCTS WITH FILTERS (FIXED)
========================================================= */
export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 8,
      category,
      fabric,
      work,
      occasion,
      size,
      color,
      minPrice,
      maxPrice
    } = req.query;

    const filters = {};

    /* CATEGORY */
    if (category) {
      filters.category = { $in: category.split(",") };
    }

    /* FABRIC */
    if (fabric) {
      filters.fabric = { $in: fabric.split(",") };
    }

    /* WORK */
    if (work) {
      filters.work = { $in: work.split(",") };
    }

    /* OCCASION */
    if (occasion) {
      filters.occasion = { $in: occasion.split(",") };
    }

    /* SIZE (ARRAY FIELD) */
    if (size) {
      filters.sizes = { $in: size.split(",") };
    }

    /* COLOR (ARRAY FIELD) */
    if (color) {
      filters.colors = { $in: color.split(",") };
    }

    /* PRICE RANGE */
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = Number(minPrice);
      if (maxPrice) filters.price.$lte = Number(maxPrice);
    }

    /* PAGINATION */
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const products = await Product.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const totalProducts = await Product.countDocuments(filters);

    res.json({
      products,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalProducts / limitNumber),
      totalProducts
    });

  } catch (err) {
    console.error("FILTER ERROR:", err);
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
  name: { $regex: q, $options: "i" }
})
  .select("name price images")
  .limit(8);

res.json(products);


} catch (err) {
console.error("SEARCH ERROR:", err);
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
console.error("GET PRODUCT ERROR:", err);
res.status(500).json({ message: err.message });
}
};

/* =========================================================
CREATE PRODUCT
========================================================= */
export const createProduct = async (req, res) => {
try {
if (!req.files || req.files.length === 0)
return res.status(400).json({ message: "Please upload images" });


const imageUrls = [];

for (const file of req.files) {
  const url = await uploadToCloudinary(file);
  imageUrls.push(url);
}

const product = await Product.create({
  ...req.body,
  price: Number(req.body.price),
  readyMade: req.body.readyMade === "true",
  featured: req.body.featured === "true",
  sizes: safeJSON(req.body.sizes),
  colors: safeJSON(req.body.colors),
  images: imageUrls
});

res.status(201).json(product);


} catch (err) {
console.error("CREATE PRODUCT ERROR:", err);
res.status(500).json({ message: err.message });
}
};

/* =========================================================
UPDATE PRODUCT
========================================================= */
export const updateProduct = async (req, res) => {
try {
const existingProduct = await Product.findById(req.params.id);
if (!existingProduct)
return res.status(404).json({ message: "Product not found" });


let images = existingProduct.images;

if (req.files && req.files.length > 0) {
  images = [];
  for (const file of req.files) {
    const url = await uploadToCloudinary(file);
    images.push(url);
  }
}

const updated = await Product.findByIdAndUpdate(
  req.params.id,
  {
    ...req.body,
    price: Number(req.body.price),
    readyMade: req.body.readyMade === "true",
    featured: req.body.featured === "true",
    sizes: req.body.sizes ? safeJSON(req.body.sizes) : existingProduct.sizes,
    colors: req.body.colors ? safeJSON(req.body.colors) : existingProduct.colors,
    images
  },
  { new: true }
);

res.json(updated);


} catch (err) {
console.error("UPDATE PRODUCT ERROR:", err);
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


await Product.findByIdAndDelete(req.params.id);
res.json({ message: "Product deleted successfully" });


} catch (err) {
console.error("DELETE PRODUCT ERROR:", err);
res.status(500).json({ message: err.message });
}
};
