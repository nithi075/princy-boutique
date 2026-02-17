import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

/* =========================================================
   GET USER CART
   ========================================================= */
export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id })
      .populate("productId");

    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   ADD TO CART
   ========================================================= */
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const existing = await Cart.findOne({
      userId: req.user._id,
      productId
    });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.json(existing);
    }

    const item = await Cart.create({
      userId: req.user._id,
      productId,
      quantity
    });

    res.json(item);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   REMOVE FROM CART
   ========================================================= */
export const removeFromCart = async (req, res) => {
  try {
    const item = await Cart.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item)
      return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item removed from cart" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   UPDATE QUANTITY
   ========================================================= */
export const updateCart = async (req, res) => {
  try {
    const item = await Cart.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!item)
      return res.status(404).json({ message: "Item not found" });

    item.quantity = req.body.quantity;
    await item.save();

    res.json(item);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================================
   CLEAR USER CART (AFTER ORDER)
   ========================================================= */
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id });
    res.json({ message: "Cart cleared after order" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
