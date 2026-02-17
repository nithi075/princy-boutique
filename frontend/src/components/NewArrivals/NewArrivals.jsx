import { useEffect, useState } from "react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./NewArrivals.css";

const BASE_URL = "http://localhost:5000";

const formatPrice = (price) =>
  "₹" + new Intl.NumberFormat("en-IN").format(price);

export default function NewArrivals() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [added, setAdded] = useState({});
  const [loading, setLoading] = useState(true);

  /* ================= LOAD PRODUCTS (PUBLIC) ================= */
  useEffect(() => {

    const loadProducts = async () => {
      try {
        const res = await API.get("/products", {
          params: { page: 1, limit: 8 }
        });

        setProducts(res.data.products || []);
      } catch (err) {
        console.log("Products load error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    /* LOAD WISHLIST (ONLY IF LOGGED IN) */
    const loadWishlist = async () => {
      try {
        const wish = await API.get("/wishlist");
        setWishlistItems(wish.data || []);
        setWishlist((wish.data || []).map(i => i.productId._id));
      } catch {
        // guest user → ignore
      }
    };

    loadProducts();
    loadWishlist();

  }, []);

  /* ================= WISHLIST ================= */
  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        const item = wishlistItems.find(i => i.productId._id === productId);
        if (!item) return;

        await API.delete(`/wishlist/${item._id}`);
        setWishlist(prev => prev.filter(id => id !== productId));
      } else {
        const res = await API.post("/wishlist", { productId });
        setWishlist(prev => [...prev, productId]);
        setWishlistItems(prev => [...prev, res.data]);
      }
    } catch {
      alert("Please login to use wishlist");
    }
  };

  /* ================= ADD TO CART ================= */
  const addToCart = async (productId) => {
    try {
      await API.post("/cart", { productId, quantity: 1 });
      setAdded(prev => ({ ...prev, [productId]: true }));
    } catch {
      alert("Please login first");
    }
  };

  /* ================= UI ================= */
  return (
    <section className="newarrivals-wrap">

      <div className="newarrivals-header">
        <h3 className="newarrivals-title">New Arrivals</h3>
        <button className="newarrivals-more" onClick={() => navigate("/shop")}>
          View All ›
        </button>
      </div>

      <div className="newarrivals-slider">
        <div className="newarrivals-track">

          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div className="newarrivals-card skeleton" key={i}>
                  <div className="newarrivals-imgbox shimmer"></div>
                  <div className="newarrivals-info">
                    <div className="line shimmer"></div>
                    <div className="line small shimmer"></div>
                  </div>
                </div>
              ))

            : products.map(item => {

                const imageUrl = item.images?.length
                  ? `${BASE_URL}${item.images[0]}`
                  : "https://via.placeholder.com/300x400?text=No+Image";

                return (
                  <div
                    className="newarrivals-card"
                    key={item._id}
                    onClick={() => navigate(`/product/${item._id}`)}
                  >
                    <div className="newarrivals-imgbox">

                      <img src={imageUrl} alt={item.name} loading="lazy" />

                      <button
                        className={`newarrivals-wishlist ${
                          wishlist.includes(item._id) ? "liked" : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(item._id);
                        }}
                      >
                        {wishlist.includes(item._id) ? <FaHeart /> : <FiHeart />}
                      </button>

                      <div className="newarrivals-overlay">
                        <button
                          className={`newarrivals-btn ${added[item._id] ? "added" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item._id);
                          }}
                        >
                          {added[item._id] ? "Added ✓" : "Add to Bag"}
                        </button>
                      </div>

                    </div>

                    <div className="newarrivals-info">
                      <p className="newarrivals-name">{item.name}</p>
                      <span className="newarrivals-price">
                        {formatPrice(item.price || 0)}
                      </span>
                    </div>
                  </div>
                );
            })
          }

        </div>
      </div>

    </section>
  );
}
