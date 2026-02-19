import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Product.css";
import { FiHeart, FiFilter, FiX, FiPlus } from "react-icons/fi";
import API from "../../api/axios";

export default function Product() {

const navigate = useNavigate();

/* UI */
const [showFilter, setShowFilter] = useState(false);

/* DATA */
const [products, setProducts] = useState([]);
const [wishlist, setWishlist] = useState([]);
const [wishlistItems, setWishlistItems] = useState([]);

/* PAGINATION */
const [currentPage, setCurrentPage] = useState(1);
const [totalPages, setTotalPages] = useState(1);
const limit = 8;

/* FILTER STATES */
const [category, setCategory] = useState([]);
const [priceRange, setPriceRange] = useState([0,100000]);
const [color, setColor] = useState([]);
const [size, setSize] = useState([]);
const [fabric, setFabric] = useState([]);
const [work, setWork] = useState([]);
const [occasion, setOccasion] = useState([]);

/* OPTIONS */
const categories = ["Saree","Kurti","Gown","Night Dress","Nighty"];
const fabrics = ["Cotton","Silk","Rayon"];
const works = ["Printed","Embroidered","Minimal","Plain"];
const occasions = ["Daily Wear","Casual Wear","Festive Wear","Party Wear","Wedding Wear"];
const sizes = ["XS","S","M","L","XL","Free"];
const colors = ["Red","Maroon","Pink","Blue","Green","Yellow","Black","White","Gold","Silver","Purple","Orange"];

/* SAFE ARRAY PARSER */
const parseArray = (value) => {
if (Array.isArray(value)) return value;
if (!value) return [];
try { return JSON.parse(value); }
catch { return [value]; }
};

/* FETCH PRODUCTS */
const fetchProducts = async () => {
try {

const res = await API.get("/products", {
params: {
page: currentPage,
limit,
category: category.join(","),
fabric: fabric.join(","),
work: work.join(","),
occasion: occasion.join(","),
size: size.join(","),
color: color.join(","),
minPrice: priceRange[0],
maxPrice: priceRange[1]
}
});

const safeProducts = res.data.products.map(p => ({
...p,
sizes: parseArray(p.sizes),
colors: parseArray(p.colors),
images: parseArray(p.images)
}));

setProducts(safeProducts);
setTotalPages(res.data.totalPages || 1);

} catch (err) {
console.log(err.response?.data || err.message);
}
};

/* FETCH WHEN FILTER/PAGE CHANGE */
useEffect(() => {
fetchProducts();
}, [currentPage, category, priceRange, color, size, fabric, work, occasion]);

/* RESET PAGE ON FILTER */
useEffect(() => {
setCurrentPage(1);
}, [category, priceRange, color, size, fabric, work, occasion]);

/* MULTI SELECT */
const toggleMulti = (setter, state, value) => {
setter(state.includes(value) ? state.filter(v => v !== value) : [...state, value]);
};

/* CLEAR FILTERS */
const clearFilters = () => {
setCategory([]);
setPriceRange([0,100000]);
setColor([]);
setSize([]);
setFabric([]);
setWork([]);
setOccasion([]);
};

/* PAGINATION HANDLER */
const goToPage = (page) => {
if(page < 1 || page > totalPages) return;
setCurrentPage(page);
window.scrollTo({ top:0, behavior:"smooth" });
};

/* WISHLIST */
const toggleWishlist = async (productId) => {
try {
if (wishlist.includes(productId)) {
const item = wishlistItems.find(i => i.productId._id === productId);
await API.delete(`/wishlist/${item._id}`);
setWishlist(wishlist.filter(id => id !== productId));
} else {
const res = await API.post("/wishlist", { productId });
setWishlist([...wishlist, productId]);
setWishlistItems([...wishlistItems, res.data]);
}
} catch {}
};

/* CART */
const addToCart = async (productId) => {
try {
await API.post("/cart", { productId, quantity: 1 });
alert("Added to cart 🛒");
} catch {
alert("Login required");
}
};

return (

<div className="product-page">
<div className="shop-container">

{/* FILTER BUTTON */}
<button className="filter-btn" onClick={()=>setShowFilter(true)}> <FiFilter/> Filters </button>

{/* FILTER DRAWER */}

<div className={`overlay ${showFilter?"active":""}`} onClick={()=>setShowFilter(false)} />

<aside className={`filter-drawer ${showFilter?"open":""}`}>
<div className="drawer-header">
<h3>Filters</h3>
<FiX onClick={()=>setShowFilter(false)}/>
</div>

<div className="filter-drawer-content">

{/* CATEGORY */}

<div className="filter-section">
<h4>Category</h4>
{categories.map(c=>(
<label key={c}>
<input type="checkbox" checked={category.includes(c)}
onChange={()=>toggleMulti(setCategory,category,c)}/>
{c}
</label>
))}
</div>

{/* FABRIC */}

<div className="filter-section">
<h4>Fabric</h4>
{fabrics.map(f=>(
<label key={f}>
<input type="checkbox" checked={fabric.includes(f)}
onChange={()=>toggleMulti(setFabric,fabric,f)}/>
{f}
</label>
))}
</div>

{/* PRICE */}

<div className="filter-section">
<h4>Price</h4>
<input type="number" placeholder="Min"
value={priceRange[0]}
onChange={(e)=>setPriceRange([Number(e.target.value),priceRange[1]])}/>
<input type="number" placeholder="Max"
value={priceRange[1]}
onChange={(e)=>setPriceRange([priceRange[0],Number(e.target.value)])}/>
</div>

</div>

<div className="filter-actions">
<button className="clear-btn" onClick={clearFilters}>Clear</button>
<button className="apply-btn" onClick={()=>setShowFilter(false)}>Apply</button>
</div>
</aside>

{/* PRODUCT GRID */}

<div className="product-grid">
{products.map(item=>(
<div className="product-card" key={item._id}>

<div className="image-box">
<img src={item.images?.[0] || "/placeholder.png"} alt={item.name}
onClick={()=>navigate(`/product/${item._id}`)}/>

<button className={`wishlist-icon ${wishlist.includes(item._id)?"liked":""}`}
onClick={()=>toggleWishlist(item._id)}> <FiHeart/> </button>

<button className="quick-add-btn" onClick={()=>addToCart(item._id)}> <FiPlus/> Quick Add </button>

</div>

<div className="product-info">
<h4 className="product-name">{item.name}</h4>
<span className="current-price">₹{Number(item.price||0).toLocaleString("en-IN")}</span>
</div>

</div>
))}
</div>

{/* PAGINATION UI */}

<div className="pagination">
<button className="page-btn" disabled={currentPage===1}
onClick={()=>goToPage(currentPage-1)}>Prev</button>

{Array.from({length:totalPages},(_,i)=>(
<button key={i}
className={`page-number ${currentPage===i+1?"active":""}`}
onClick={()=>goToPage(i+1)}>
{i+1} </button>
))}

<button className="page-btn" disabled={currentPage===totalPages}
onClick={()=>goToPage(currentPage+1)}>Next</button>

</div>

</div>
</div>
);
}
