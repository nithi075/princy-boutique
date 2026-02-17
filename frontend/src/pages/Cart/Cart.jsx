import React, { useEffect, useState } from "react";
import "./Cart.css";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

export default function Cart() {

  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  /* ---------------- LOAD CART ---------------- */
  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCartItems(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ---------------- QTY ---------------- */
  const increaseQty = async (item) => {
    await API.put(`/cart/${item._id}`, {
      quantity: item.quantity + 1
    });
    fetchCart();
  };

  const decreaseQty = async (item) => {
    if (item.quantity <= 1) return;

    await API.put(`/cart/${item._id}`, {
      quantity: item.quantity - 1
    });
    fetchCart();
  };

  /* ---------------- REMOVE ---------------- */
  const removeItem = async (id) => {
    await API.delete(`/cart/${id}`);
    fetchCart();
  };

  /* ---------------- TOTAL ---------------- */
  const subtotal = cartItems.reduce(
    (acc, item) =>
      acc + item.quantity * (item.productId?.price || 0),
    0
  );
const goToCheckout = () => {
  navigate("/checkout");
};



  return (
    <div className="cart-wrapper">

      <h1 className="cart-heading">Cart</h1>

      <div className="cart-container">

        {/* LEFT SIDE */}
        <div className="cart-left">

          {cartItems.length === 0 && (
            <p>Your cart is empty</p>
          )}

          {cartItems.map(item => {

            const product = item.productId;

            const imageUrl = product?.images?.length
              ? `${BASE_URL}${product.images[0]}`
              : "https://via.placeholder.com/200x250?text=No+Image";

            return (
              <div className="cart-item" key={item._id}>

                <img src={imageUrl} alt={product?.name || "product"} />

                <div className="cart-details">
                  <h3>{product?.name}</h3>

                  <p className="item-price">
                    ₹{product?.price?.toLocaleString()}
                  </p>

                  <div className="quantity">
                    <button onClick={() => decreaseQty(item)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increaseQty(item)}>+</button>
                  </div>

                  <button
                    className="remove"
                    onClick={() => removeItem(item._id)}
                  >
                    Remove
                  </button>
                </div>

                <div className="item-total">
                  ₹{(item.quantity * (product?.price || 0)).toLocaleString()}
                </div>

              </div>
            );
          })}

          <button className="continue" onClick={() => navigate("/shop")}>
            Continue Shopping
          </button>

        </div>

        {/* RIGHT SIDE SUMMARY */}
        <div className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span className="light-text">Calculated at next step</span>
          </div>

          <div className="summary-total">
            <span>Estimated</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>

      <button className="checkout" onClick={goToCheckout}>
        Proceed to Checkout
      </button>


          <p className="secure">
            Secure checkout. Shopping is always safe and secure.
          </p>

        </div>

      </div>

    </div>
  );
}
