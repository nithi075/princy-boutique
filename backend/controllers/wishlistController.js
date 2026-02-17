import Wishlist from "../models/Wishlist.js";

/* GET WISHLIST */
export const getWishlist = async (req, res) => {
  const items = await Wishlist.find({ userId: req.user._id })
    .populate("productId");

  res.json(items);
};

/* ADD TO WISHLIST */
export const addToWishlist = async (req, res) => {
  const { productId } = req.body;

  const existing = await Wishlist.findOne({
    userId: req.user._id,
    productId
  });

  if (existing)
    return res.status(400).json({ message: "Already in wishlist" });

  const item = await Wishlist.create({
    userId: req.user._id,
    productId
  });

  res.json(item);
};

/* REMOVE FROM WISHLIST */
export const removeFromWishlist = async (req, res) => {
  await Wishlist.findByIdAndDelete(req.params.id);
  res.json({ message: "Removed from wishlist" });
};
