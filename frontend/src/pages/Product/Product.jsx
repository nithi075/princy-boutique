import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import { FiHeart, FiFilter, FiX, FiPlus } from "react-icons/fi";
import API from "../../api/axios";

export default function Product() {
  const navigate = useNavigate();

  /* UI STATES */
  const [showFilter, setShowFilter] = useState(false);

  /* DATA STATES */
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]); // Stores string IDs
  const [wishlistItems, setWishlistItems] = useState([]); // Stores full objects

  /* PAGINATION & FILTERS */
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 8;

  const [category, setCategory] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [color, setColor] = useState([]);
  const [size, setSize] = useState([]);
  const [fabric, setFabric] = useState([]);
  const [work, setWork] = useState([]);
  const [occasion, setOccasion] = useState([]);

  /* CONFIGURATION OPTIONS */
  const categories = ["Sharara", "Kurti", "Gown", "Night Dress", "Short Kurti"];
  const fabrics = ["Cotton", "Silk", "Rayon"];
  const works = ["Printed", "Embroidered", "Minimal", "Plain"];
  const occasions = ["Daily Wear", "Casual Wear", "Festive Wear", "Party Wear", "Wedding Wear"];
  const sizes = ["XS", "S", "M", "L", "XL", "Free"];
  const colors = ["Red", "Maroon", "Pink", "Blue", "Green", "Yellow", "Black", "White", "Gold", "Silver", "Purple", "Orange"];

  /* HELPER: PARSE ARRAYS FROM DB */
  const parseArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    try { return JSON.parse(value); } 
    catch { return [value]; }
  };

  /* 1. BUILD CLEAN PARAMS */
  const buildParams = useCallback(() => {
    const params = { page: currentPage, limit };

    if (category.length) params.category = category.join(",");
    if (fabric.length) params.fabric = fabric.join(",");
    if (work.length) params.work = work.join(",");
    if (occasion.length) params.occasion = occasion.join(",");
    if (size.length) params.size = size.join(",");
    if (color.length) params.color = color.join(",");

    params.minPrice = priceRange[0];
    params.maxPrice = priceRange[1];

    return params;
  }, [currentPage, category, fabric, work, occasion, size, color, priceRange]);

  /* 2. FETCH PRODUCTS FUNCTION */
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products", { params: buildParams() });
      const safeProducts = res.data.products.map((p) => ({
        ...p,
        sizes: parseArray(p.sizes),
        colors: parseArray(p.colors),
        images: parseArray(p.images),
      }));

      setProducts(safeProducts);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Fetch Error:", err.response?.data || err.message);
    }
  };

  /* 3. INITIAL WISHLIST LOAD (UPDATED) */
  useEffect(() => {
    const loadWishlist = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const wish = await API.get("/wishlist");
        setWishlistItems(wish.data);
        // Convert ObjectIds to strings for stable comparison
        setWishlist(
            wish.data
                .filter(i => i.productId) // ⭐ prevent null crash
                .map(i => i.productId._id.toString())
            );
      } catch (err) { console.log("Wishlist error", err); }
    };
    loadWishlist();
  }, []);

  /* 4. EFFECT TRIGGERS */
  useEffect(() => { setCurrentPage(1); }, [category, priceRange, color, size, fabric, work, occasion]);
  useEffect(() => { fetchProducts(); }, [currentPage, category, priceRange, color, size, fabric, work, occasion]);

  /* UI HANDLERS */
  const toggleMulti = (setter, state, value) => {
    setter(state.includes(value) ? state.filter((v) => v !== value) : [...state, value]);
  };

  const clearFilters = () => {
    setCategory([]);
    setPriceRange([0, 100000]);
    setColor([]);
    setSize([]);
    setFabric([]);
    setWork([]);
    setOccasion([]);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* 5. TOGGLE WISHLIST (UPDATED) */
  const toggleWishlist = async (productId) => {
    const id = productId.toString();
    try {
      if (wishlist.includes(id)) {
        const item = wishlistItems.find((i) => i.productId._id.toString() === id);
        if (!item) return;

        await API.delete(`/wishlist/${item._id}`);
        setWishlist((prev) => prev.filter((wid) => wid !== id));
        setWishlistItems((prev) => prev.filter((w) => w._id !== item._id));
      } else {
        const res = await API.post("/wishlist", { productId: id });
        setWishlist((prev) => [...prev, id]);
        setWishlistItems((prev) => [...prev, res.data]);
      }
    } catch (err) { alert("Action failed. Please login."); }
  };

  const addToCart = async (productId) => {
    try {
      await API.post("/cart", { productId, quantity: 1 });
      alert("Added to cart 🛒");
    } catch { alert("Login required"); }
  };

  return (
    <div className="product-page">
      <div className="shop-container">
        <header className="shop-header">
          <div className="header-text">
            <h1 className="page-title">The Signature Collection</h1>
            <p className="page-sub">Timeless elegance meets contemporary craft.</p>
          </div>
          <button className="filter-btn" onClick={() => setShowFilter(true)}>
            <FiFilter /> Filters
          </button>
        </header>

        <div className={`overlay ${showFilter ? "active" : ""}`} onClick={() => setShowFilter(false)} />

        <aside className={`filter-drawer ${showFilter ? "open" : ""}`}>
          <div className="drawer-header">
            <h3>Filters</h3>
            <FiX onClick={() => setShowFilter(false)} style={{ cursor: "pointer" }} />
          </div>

          <div className="filter-drawer-content">
            <div className="filter-section">
              <h4>Category</h4>
              {categories.map((c) => (
                <label key={c}>
                  <input type="checkbox" checked={category.includes(c)} onChange={() => toggleMulti(setCategory, category, c)} />
                  {c}
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h4>Fabric</h4>
              {fabrics.map((f) => (
                <label key={f}>
                  <input type="checkbox" checked={fabric.includes(f)} onChange={() => toggleMulti(setFabric, fabric, f)} />
                  {f}
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h4>Work</h4>
              {works.map((w) => (
                <label key={w}>
                  <input type="checkbox" checked={work.includes(w)} onChange={() => toggleMulti(setWork, work, w)} />
                  {w}
                </label>
              ))}
            </div>

            <div className="filter-section">
              <h4>Size</h4>
              <div className="size-row">
                {sizes.map((s) => (
                  <span key={s} className={size.includes(s) ? "active" : ""} onClick={() => toggleMulti(setSize, size, s)}>
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Color</h4>
              <div className="color-row">
                {colors.map((c) => (
                  <div
                    key={c}
                    className={`color ${color.includes(c) ? "active" : ""}`}
                    style={{ background: c.toLowerCase() }}
                    onClick={() => toggleMulti(setColor, color, c)}
                  />
                ))}
              </div>
            </div>

            <div className="filter-section">
              <h4>Price (₹)</h4>
              <div className="price-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                />
              </div>
            </div>
          </div>

          <div className="filter-actions">
            <button className="clear-btn" onClick={clearFilters}>Clear All</button>
            <button className="apply-btn" onClick={() => setShowFilter(false)}>Apply</button>
          </div>
        </aside>

        <div className="product-grid">
          {products.length > 0 ? (
            products.map((item) => (
              <div className="product-card" key={item._id}>
                <div className="image-box">
                  <img src={item.images?.[0] || "/placeholder.png"} alt={item.name} onClick={() => navigate(`/product/${item._id}`)} />
                  
                  {/* Updated Wishlist Button Check */}
                  <button 
                    className={`wishlist-icon ${wishlist.includes(item._id.toString()) ? "liked" : ""}`} 
                    onClick={() => toggleWishlist(item._id)}
                  >
                    <FiHeart />
                  </button>

                  <button className="quick-add-btn" onClick={() => addToCart(item._id)}>
                    <FiPlus /> Quick Add
                  </button>
                </div>
                <div className="product-info">
                  <h4 className="product-name">{item.name}</h4>
                  <span className="current-price">₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">No products found matching these filters.</div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button className="page-btn" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} className={`page-number ${currentPage === i + 1 ? "active" : ""}`} onClick={() => goToPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button className="page-btn" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next</button>
          </div>
        )}
      </div>
    </div>
  );
}