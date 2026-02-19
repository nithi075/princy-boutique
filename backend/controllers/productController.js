import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

/* =========================================================
CLOUDINARY BUFFER UPLOAD HELPER
========================================================= */
const uploadToCloudinary = (buffer) => {
return new Promise((resolve, reject) => {
const stream = cloudinary.uploader.upload_stream(
{ folder: "products" },
(error, result) => {
if (error) return reject(error);
resolve(result.secure_url);
}
);
streamifier.createReadStream(buffer).pipe(stream);
});
};

/* =========================================================
GET PRODUCTS
========================================================= */
export const getProducts = async (req, res) => {
try {
const { page, limit } = req.query;


let query = Product.find().sort({ createdAt: -1 });
const totalProducts = await Product.countDocuments();

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
console.error("GET PRODUCTS ERROR:", err);
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
CREATE PRODUCT (CLOUDINARY FIXED)
========================================================= */
export const createProduct = async (req, res) => {
  try {
    console.log("FILES:", req.files?.length);
    console.log("BODY:", req.body);

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files received" });
    }

    const imageUrls = [];

    for (const file of req.files) {
      try {
        console.log("Uploading:", file.originalname, file.mimetype, file.size);

        const url = await uploadToCloudinary(file);

        console.log("Uploaded URL:", url);
        imageUrls.push(url);

      } catch (uploadErr) {
        console.error("UPLOAD FAILED:", uploadErr);
        return res.status(500).json({ message: "Cloudinary upload failed", error: uploadErr.message });
      }
    }

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
    console.error("CREATE PRODUCT FATAL:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
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

  // delete old images
  for (const img of existingProduct.images) {
    try {
      const publicId = img.split("/").slice(-2).join("/").split(".")[0];
      await cloudinary.uploader.destroy(publicId);
    } catch {}
  }

  images = [];
  for (const file of req.files) {
    const url = await uploadToCloudinary(file.buffer);
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
    sizes: req.body.sizes ? JSON.parse(req.body.sizes) : existingProduct.sizes,
    colors: req.body.colors ? JSON.parse(req.body.colors) : existingProduct.colors,
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


for (const img of product.images) {
  try {
    const publicId = img.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  } catch {}
}

await Product.findByIdAndDelete(req.params.id);

res.json({ message: "Product deleted successfully" });


} catch (err) {
console.error("DELETE PRODUCT ERROR:", err);
res.status(500).json({ message: err.message });
}
};
