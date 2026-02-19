import { useState, useEffect, useRef } from "react";
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

const firstLoad = useRef(true);

/* OPTIONS */
const categories = ["Sharara","Kurti","Gown","Night Dress","Short Kurti"];
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

/* BUILD PARAMS CLEAN */
const buildParams = () => {
const params = {
page: currentPage,
limit
};

if(category.length) params.category = category.join(",");
if(fabric.length) params.fabric = fabric.join(",");
if(work.length) params.work = work.join(",");
if(occasion.length) params.occasion = occasion.join(",");
if(size.length) params.size = size.join(",");
if(color.length) params.color = color.join(",");

if(priceRange[0] > 0) params.minPrice = priceRange[0];
if(priceRange[1] < 100000) params.maxPrice = priceRange[1];

return params;
};

/* FETCH PRODUCTS */
const fetchProducts = async () => {
try {

const res = await API.get("/products", {
params: buildParams()
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

/* LOAD WISHLIST */
useEffect(() => {
const loadWishlist = async () => {
const token = localStorage.getItem("token");
if (!token) return;
try {
const wish = await API.get("/wishlist");
setWishlistItems(wish.data);
setWishlist(wish.data.map(i => i.productId._id));
} catch {}
};
loadWishlist();
}, []);

/* RESET PAGE WHEN FILTER CHANGE */
useEffect(() => {
if(firstLoad.current){
firstLoad.current = false;
return;
}
setCurrentPage(1);
}, [category, priceRange, color, size, fabric, work, occasion]);

/* FETCH DATA */
useEffect(() => {
fetchProducts();
}, [currentPage, category, priceRange, color, size, fabric, work, occasion]);

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

/* PAGINATION */
const goToPage = (page) => {
if(page<1 || page>totalPages) return;
setCurrentPage(page);
window.scrollTo({top:0,behavior:"smooth"});
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

<header className="shop-header">
<div className="header-text">
<h1 className="page-title">The Signature Collection</h1>
<p className="page-sub">Timeless elegance meets contemporary craft.</p>
</div>

<button className="filter-btn" onClick={()=>setShowFilter(true)}>
<FiFilter/> Filters
</button>
</header>

{/* PRODUCTS */}
<div className="product-grid">
{products.map(item=>(
<div className="product-card" key={item._id}>
<div className="image-box">
<img src={item.images?.[0] || "/placeholder.png"} alt={item.name}
onClick={()=>navigate(`/product/${item._id}`)}/>
<button className={`wishlist-icon ${wishlist.includes(item._id)?"liked":""}`}
onClick={()=>toggleWishlist(item._id)}><FiHeart/></button>
<button className="quick-add-btn" onClick={()=>addToCart(item._id)}>
<FiPlus/> Quick Add</button>
</div>
<div className="product-info">
<h4 className="product-name">{item.name}</h4>
<span className="current-price">
₹{Number(item.price||0).toLocaleString("en-IN")}
</span>
</div>
</div>
))}
</div>

{/* PAGINATION */}
<div className="pagination">
<button disabled={currentPage===1} onClick={()=>goToPage(currentPage-1)}>Prev</button>

{Array.from({length:totalPages},(_,i)=>(
<button key={i} className={currentPage===i+1?"active":""}
onClick={()=>goToPage(i+1)}>{i+1}</button>
))}

<button disabled={currentPage===totalPages} onClick={()=>goToPage(currentPage+1)}>Next</button>
</div>

</div>
</div>
);
}
