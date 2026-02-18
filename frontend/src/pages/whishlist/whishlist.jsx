import React, { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import "./whishlist.css";
import API from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {

  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  /* ---------------- LOAD WISHLIST ---------------- */
  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setItems(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  /* ---------------- REMOVE ---------------- */
  const removeFromWishlist = async (id) => {
    try {
      await API.delete(`/wishlist/${id}`);
      fetchWishlist();
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  /* ---------------- ADD TO CART ---------------- */
  const addToCart = async (productId) => {
    try {
      await API.post("/cart", {
        productId,
        quantity: 1
      });
      alert("Added to cart");
    } catch (err) {
      alert(err.response?.data?.message || "Login required");
    }
  };

  return (
    <div className="wishlist-page">
      <div className="shop-container">

        {/* HEADER */}
        <div className="shop-header">
          <h1 className="page-title">My Wishlist</h1>
          <p className="page-sub">
            Pieces you’ve fallen in love with ✨
          </p>
        </div>

        {/* EMPTY */}
        {items.length === 0 && (
          <h3 style={{ textAlign: "center", marginTop: "60px" }}>
            Your wishlist is empty 💔
          </h3>
        )}

        {/* GRID */}
        <div className="product-grid">
          {items.map(item => {

            const product = item.productId;

            // ✅ Cloudinary image
            const imageUrl =
              product?.images?.[0] ||
              "https://via.placeholder.com/300x400?text=No+Image";

            return (
              <div
                className="product-card"
                key={item._id}
                onClick={() => navigate(`/product/${product._id}`)}
              >

                <div className="image-box">

                  <img
                    src={imageUrl}
                    alt={product.name}
                    loading="lazy"
                  />

                  {/* REMOVE HEART */}
                  <button
                    className="wishlist-icon liked"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromWishlist(item._id);
                    }}
                  >
                    <FiHeart fill="currentColor" />
                  </button>

                  {/* ADD TO CART */}
                  <button
                    className="quick-add-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product._id);
                    }}
                  >
                    Add to Cart
                  </button>

                </div>

                <div className="product-info">
                  <h3 className="product-name">
                    {product.name}
                  </h3>

                  <div className="price-container">
                    <span className="current-price">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
