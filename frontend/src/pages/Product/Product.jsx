import { useState, useEffect, useMemo } from "react";
import "./Product.css";
import { FiHeart, FiFilter, FiX, FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";

export default function Product() {

  const navigate = useNavigate();

  /* ---------------- STATES ---------------- */

  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  /* filters */
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [selectedFabric, setSelectedFabric] = useState([]);
  const [selectedWork, setSelectedWork] = useState([]);
  const [selectedOccasion, setSelectedOccasion] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  /* sort */
  const [sortType, setSortType] = useState("featured");

  /* pagination */
  const [page, setPage] = useState(1);
  const perPage = 8;

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const parseArray = (value) => {
    if (Array.isArray(value)) return value;
    if (!value) return [];
    if (typeof value === "string") {
      try { return JSON.parse(value); }
      catch { return [value]; }
    }
    return [];
  };

  const fetchProducts = async () => {
    const res = await API.get("/products");

    const safeProducts = res.data.map(p => ({
      ...p,
      sizes: parseArray(p.sizes),
      colors: parseArray(p.colors),
      images: parseArray(p.images)
    }));

    setProducts(safeProducts);
  };

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data.map(w => w.productId));
    } catch {}
  };

  /* ---------------- WISHLIST ---------------- */

  const toggleWishlist = async (id) => {
    await API.post("/wishlist", { productId: id });

    setWishlist(prev =>
      prev.includes(id)
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  /* ---------------- CART ---------------- */

  const addToCart = async (id) => {
    await API.post("/cart", { productId: id, quantity: 1 });
    alert("Added to cart 🛒");
  };

  /* ---------------- TOGGLE HELPER ---------------- */

  const toggleArrayFilter = (value, state, setState) => {
    setState(prev =>
      prev.includes(value)
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredProducts = useMemo(() => {

    let data = [...products];

    if (selectedCategory.length)
      data = data.filter(p => selectedCategory.includes(p.category));

    if (selectedFabric.length)
      data = data.filter(p => selectedFabric.includes(p.fabric));

    if (selectedWork.length)
      data = data.filter(p => selectedWork.includes(p.work));

    if (selectedOccasion.length)
      data = data.filter(p => selectedOccasion.includes(p.occasion));

    if (selectedSizes.length)
      data = data.filter(p =>
        Array.isArray(p.sizes) &&
        p.sizes.some(size => selectedSizes.includes(size))
      );

    if (selectedColors.length)
      data = data.filter(p =>
        Array.isArray(p.colors) &&
        p.colors.some(color => selectedColors.includes(color))
      );

    data = data.filter(p =>
      p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    /* sorting */
    if (sortType === "low") data.sort((a,b)=>a.price-b.price);
    if (sortType === "high") data.sort((a,b)=>b.price-a.price);
    if (sortType === "featured")
      data.sort((a,b)=> (b.featured===true)-(a.featured===true));

    return data;

  }, [
    products,
    selectedCategory,
    selectedFabric,
    selectedWork,
    selectedOccasion,
    selectedSizes,
    selectedColors,
    priceRange,
    sortType
  ]);

  /* ---------------- PAGINATION ---------------- */

  const totalPages = Math.ceil(filteredProducts.length / perPage);

  const paginatedProducts = useMemo(()=>{
    const start = (page-1)*perPage;
    return filteredProducts.slice(start, start+perPage);
  },[filteredProducts,page]);

  useEffect(()=>setPage(1),[
    selectedCategory,
    selectedFabric,
    selectedWork,
    selectedOccasion,
    selectedSizes,
    selectedColors,
    priceRange,
    sortType
  ]);

  /* ---------------- UI ---------------- */

  return (
    <div className="product-page">
      <div className="shop-container">

        {/* HEADER */}
        <header className="shop-header">
          <div className="header-text">
            <h1 className="page-title">The Signature Collection</h1>
            <p className="page-sub">
              Timeless elegance meets contemporary craft.
            </p>
          </div>

          <div className="top-bar">
            <button className="filter-btn" onClick={()=>setShowFilter(true)}>
              <FiFilter/> Filters
            </button>

            <select className="sort-select" onChange={(e)=>setSortType(e.target.value)}>
              <option value="featured">Sort By: Featured</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </header>

        {/* OVERLAY */}
        <div className={`overlay ${showFilter?"active":""}`} onClick={()=>setShowFilter(false)}/>

        {/* FILTER DRAWER */}
        <aside className={`filter-drawer ${showFilter?"open":""}`}>
          <div className="drawer-header">
            <h3>Filters</h3>
            <FiX onClick={()=>setShowFilter(false)}/>
          </div>

          <div className="filter-drawer-content">

            {/* CATEGORY */}
            <div className="filter-section">
              <h4>Category</h4>
              {["Saree","Kurti","Gown","Night Dress","Nighty"].map(cat=>(
                <label key={cat}>
                  <input type="checkbox"
                    checked={selectedCategory.includes(cat)}
                    onChange={()=>toggleArrayFilter(cat,selectedCategory,setSelectedCategory)}
                  />
                  {cat}
                </label>
              ))}
            </div>

            {/* FABRIC */}
            <div className="filter-section">
              <h4>Fabric</h4>
              {["Cotton","Silk","Rayon"].map(v=>(
                <label key={v}>
                  <input type="checkbox"
                    checked={selectedFabric.includes(v)}
                    onChange={()=>toggleArrayFilter(v,selectedFabric,setSelectedFabric)}
                  />
                  {v}
                </label>
              ))}
            </div>

            {/* WORK */}
            <div className="filter-section">
              <h4>Work</h4>
              {["Printed","Embroidered","Minimal","Plain"].map(v=>(
                <label key={v}>
                  <input type="checkbox"
                    checked={selectedWork.includes(v)}
                    onChange={()=>toggleArrayFilter(v,selectedWork,setSelectedWork)}
                  />
                  {v}
                </label>
              ))}
            </div>

            {/* OCCASION */}
            <div className="filter-section">
              <h4>Occasion</h4>
              {["Daily Wear","Casual Wear","Festive Wear","Party Wear","Wedding Wear"].map(v=>(
                <label key={v}>
                  <input type="checkbox"
                    checked={selectedOccasion.includes(v)}
                    onChange={()=>toggleArrayFilter(v,selectedOccasion,setSelectedOccasion)}
                  />
                  {v}
                </label>
              ))}
            </div>

            {/* SIZE */}
            <div className="filter-section">
              <h4>Size</h4>
              <div className="size-row">
                {["XS","S","M","L","XL","Free"].map(size=>(
                  <span
                    key={size}
                    className={selectedSizes.includes(size)?"active":""}
                    onClick={()=>toggleArrayFilter(size,selectedSizes,setSelectedSizes)}
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div className="filter-section">
              <h4>Color</h4>
              <div className="color-row">
                {["Red","Maroon","Pink","Blue","Green","Yellow","Black","White","Gold","Silver","Purple","Orange"]
                  .map(color=>(
                  <div
                    key={color}
                    className={`color ${selectedColors.includes(color)?"active":""}`}
                    style={{background:color.toLowerCase()}}
                    onClick={()=>toggleArrayFilter(color,selectedColors,setSelectedColors)}
                  />
                ))}
              </div>
            </div>

            {/* PRICE */}
            <div className="filter-section">
              <h4>Price</h4>
              <input type="number" placeholder="Min"
                value={priceRange[0]}
                onChange={(e)=>setPriceRange([Number(e.target.value),priceRange[1]])}
              />
              <input type="number" placeholder="Max"
                value={priceRange[1]}
                onChange={(e)=>setPriceRange([priceRange[0],Number(e.target.value)])}
              />
            </div>

          </div>
        </aside>

        {/* PRODUCT GRID */}
        <div className="product-grid">
          {paginatedProducts.map(item=>(
            <div className="product-card" key={item._id}>

              <div className="image-box">
                {item.featured && <span className="product-tag">Featured</span>}

                <img
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name}
                  onClick={()=>navigate(`/product/${item._id}`)}
                />

                <button
                  className={`wishlist-icon ${wishlist.includes(item._id)?"liked":""}`}
                  onClick={()=>toggleWishlist(item._id)}
                >
                  <FiHeart/>
                </button>

                <button className="quick-add-btn" onClick={()=>addToCart(item._id)}>
                  <FiPlus/> Quick Add
                </button>
              </div>

              <div className="product-info">
                <h4 className="product-name" onClick={()=>navigate(`/product/${item._id}`)}>
                  {item.name}
                </h4>
                <span className="current-price">₹{item.price?.toLocaleString()}</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
