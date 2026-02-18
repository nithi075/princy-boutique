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
const [priceRange, setPriceRange] = useState([]);
const [color, setColor] = useState(null);
const [size, setSize] = useState(null);
const [fabric, setFabric] = useState([]);
const [work, setWork] = useState([]);
const [occasion, setOccasion] = useState([]);
const [fit, setFit] = useState([]);

/* FILTER OPTIONS */
const categories = ["Saree","Kurti","Gown","Night Dress","Nighty"];
const fabrics = ["Cotton","Silk","Rayon"];
const works = ["Printed","Embroidered","Minimal","Plain"];
const occasions = ["Daily Wear","Casual Wear","Festive Wear","Party Wear","Wedding Wear"];
const fits = ["Straight Fit","A-Line","Flared","Anarkali","Nayra Cut","Regular Fit","Loose Fit"];
const sizes = ["XS","S","M","L","XL","Free"];
const colors = ["Red","Maroon","Pink","Blue","Green","Yellow","Black","White","Gold","Silver","Purple","Orange"];
const prices = ["0-999","1000-1999","2000-2999","3000-4999","5000-9999"];

/* FETCH PRODUCTS */
const fetchProducts = async () => {
try {
const res = await API.get("/products", {
params: {
page: currentPage,
limit: limit,
category: category.join(","),
price: priceRange.join(","),
color,
size,
fabric: fabric.join(","),
work: work.join(","),
occasion: occasion.join(","),
fit: fit.join(",")
}
});
setProducts(res.data.products || []);
setTotalPages(res.data.totalPages || 1);
} catch (err) {
console.log(err.response?.data || err.message);
}
};

/* LOAD WISHLIST */
useEffect(() => {
const loadWishlist = async () => {
try {
const wish = await API.get("/wishlist");
setWishlistItems(wish.data);
setWishlist(wish.data.map(i => i.productId._id));
} catch {}
};
loadWishlist();
}, []);

/* FETCH WHEN FILTER/PAGE CHANGE */
useEffect(() => {
fetchProducts();
}, [currentPage, category, priceRange, color, size, fabric, work, occasion, fit]);

/* RESET PAGE WHEN FILTER CHANGE */
useEffect(() => {
setCurrentPage(1);
}, [category, priceRange, color, size, fabric, work, occasion, fit]);

/* MULTI SELECT */
const toggleMulti = (setter, state, value) => {
setter(state.includes(value) ? state.filter(v => v !== value) : [...state, value]);
};

/* CLEAR FILTERS */
const clearFilters = () => {
setCategory([]);
setPriceRange([]);
setColor(null);
setSize(null);
setFabric([]);
setWork([]);
setOccasion([]);
setFit([]);
};

/* PAGINATION */
const goToPage = (page) => {
if (page < 1 || page > totalPages) return;
setCurrentPage(page);
window.scrollTo({ top: 0, behavior: "smooth" });
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
} catch (err) {
console.log(err.response?.data || err.message);
}
};

/* CART */
const addToCart = async (productId) => {
try {
await API.post("/cart", { productId, quantity: 1 });
alert("Added to cart");
} catch (err) {
alert(err.response?.data?.message || "Login required");
}
};

return (
<div className="product-page">
<div className="shop-container">

{/* PRODUCTS GRID */}
<div className="product-grid">
{products.map(item => {

const imageUrl = item.images?.[0]
? item.images[0]
: "https://via.placeholder.com/300x400?text=No+Image";

return (
<div className="product-card" key={item._id} onClick={() => navigate(`/product/${item._id}`)}>

<div className="image-box">
{item.featured && <span className="product-tag">Featured</span>}

<img src={imageUrl} alt={item.name} loading="lazy" />

<button className={`wishlist-icon ${wishlist.includes(item._id) ? "liked" : ""}`}
onClick={(e)=>{e.stopPropagation();toggleWishlist(item._id);}}>
<FiHeart fill={wishlist.includes(item._id) ? "currentColor" : "none"} />
</button>

<button className="quick-add-btn"
onClick={(e)=>{e.stopPropagation();addToCart(item._id);}}>
<FiPlus /> Quick Add
</button>
</div>

<div className="product-info">
<h4 className="product-name">{item.name}</h4>
<span className="current-price">₹{Number(item.price||0).toLocaleString("en-IN")}</span>
</div>

</div>
);
})}
</div>

</div>
</div>
);
}
