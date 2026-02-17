import { useState, useEffect } from "react";
import "./Checkout.css";
import API from "../../api/axios";

export default function Checkout() {

  const BASE_URL = "http://localhost:5000"; // change after deployment

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH USER CART ================= */
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await API.get("/cart");
        setCartItems(res.data);
      } catch (err) {
        console.log(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  /* ================= TOTAL ================= */
  const total = cartItems.reduce(
    (acc, item) => acc + item.quantity * (item.productId?.price || 0),
    0
  );

  /* ================= FORM CHANGE ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ================= PLACE ORDER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      alert("Please fill all fields");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    /* ---------- FORMAT ITEMS ---------- */
    const itemsText = cartItems
      .map(item => {
        const product = item.productId;

        const imageUrl = product?.images?.length
          ? `${BASE_URL}${product.images[0]}`
          : "No Image";

        return `• ${product?.name}
Qty: ${item.quantity}
Price: ₹${product?.price * item.quantity}
Image: ${imageUrl}`;
      })
      .join("\n\n");

    /* ---------- WHATSAPP MESSAGE ---------- */
    const message = `
🛍️ *New Order - Princy Boutique*

👤 Name: ${form.name}
📞 Phone: ${form.phone}
🏠 Address: ${form.address}
🏙️ City: ${form.city}
📮 Pincode: ${form.pincode}

🛒 Order Items:
${itemsText}

💰 Total: ₹${total}
`;

    const whatsappNumber = "918667041407";
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    try {
      // clear cart after order
      await API.delete("/cart/clear");

      // redirect to whatsapp
      window.location.href = whatsappURL;

    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("Order failed. Try again.");
    }
  };

  /* ================= LOADING ================= */
  if (loading)
    return (
      <div className="checkout-page">
        <h2>Loading...</h2>
      </div>
    );

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <h1>Checkout</h1>

        <form className="checkout-form" onSubmit={handleSubmit}>

          {/* FORM */}
          <input type="text" name="name" placeholder="Full Name" onChange={handleChange} />
          <input type="tel" name="phone" placeholder="Phone Number" onChange={handleChange} />
          <textarea name="address" placeholder="Full Address" onChange={handleChange}></textarea>
          <input type="text" name="city" placeholder="City" onChange={handleChange} />
          <input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} />

          {/* ORDER SUMMARY */}
          <div className="order-summary">
            <h3>Order Summary</h3>

            {cartItems.length === 0 ? (
              <p>Your cart is empty</p>
            ) : (
              cartItems.map(item => (
                <div key={item._id} className="summary-row">
                  <span>{item.productId?.name} x {item.quantity}</span>
                  <span>₹{item.productId?.price * item.quantity}</span>
                </div>
              ))
            )}

            <div className="summary-total">
              <strong>Total</strong>
              <strong>₹{total}</strong>
            </div>
          </div>

          <button type="submit" className="place-order-btn">
            Place Order via WhatsApp
          </button>

        </form>
      </div>
    </div>
  );
}
