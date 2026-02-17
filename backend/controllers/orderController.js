import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

/* PLACE ORDER */
export const placeOrder = async (req, res) => {
  const cartItems = await Cart.find({ userId: req.user._id });

  if (cartItems.length === 0)
    return res.status(400).json({ message: "Cart is empty" });

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.quantity * 1000, // dummy pricing
    0
  );

  const order = await Order.create({
    userId: req.user._id,
    items: cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity
    })),
    totalAmount
  });

  await Cart.deleteMany({ userId: req.user._id });

  res.json(order);
};

/* GET USER ORDERS */
export const getOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
    .populate("items.productId");

  res.json(orders);
};
