import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiHeart, FiShare2 } from "react-icons/fi";
import API from "../../api/axios";
import "./productDetails.css";

const BASE_URL = "https://princy-boutique-backend.onrender.com";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [wishlist, setWishlist] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);

  /* ================= LOAD PRODUCT ================= */
  useEffect(() => {
    const loadProduct = async () => {
      try {
        /* PRODUCT */
        const res = await API.get(`/products/${id}`);
        const prod = res.data;

        setProduct(prod);
        setSelectedSize(prod.sizes?.[0] || "");

        if (prod.images?.length)
          setMainImage(`${BASE_URL}${prod.images[0]}`);

        /* RELATED PRODUCTS (CATEGORY BASED) */
        const all = await API.get("/products");

        const relatedProducts = all.data.products
          .filter(p => p.category === prod.category && p._id !== id)
          .slice(0, 4);

        setRelated(relatedProducts);

        /* WISHLIST */
        try {
          const wish = await API.get("/wishlist");
          const found = wish.data.find(i => i.productId._id === id);
          if (found) {
            setWishlist(true);
            setWishlistItemId(found._id);
          }
        } catch {
          // user not logged in
        }

      } catch (err) {
        console.log(err.message);
      }
    };

    loadProduct();
  }, [id]);

  /* ================= ADD TO CART ================= */
  const addToCart = async () => {
    try {
      await API.post("/cart", { productId: id, quantity: 1 });
      alert("Added to cart");
    } catch {
      alert("Login required");
    }
  };

  const buyNow = async () => {
    await addToCart();
    navigate("/cart");
  };

  /* ================= WISHLIST ================= */
  const toggleWishlist = async () => {
    if (wishlist) {
      await API.delete(`/wishlist/${wishlistItemId}`);
      setWishlist(false);
    } else {
      const res = await API.post("/wishlist", { productId: id });
      setWishlist(true);
      setWishlistItemId(res.data._id);
    }
  };

  /* ================= SHARE ================= */
  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/product/${id}`;
    if (navigator.share) {
      await navigator.share({ title: product.name, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied!");
    }
  };

  if (!product) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  return (
    <div className="product-page">

      <div className="product-container">

        {/* IMAGE */}
        <div className="image-section">
          <div className="main-image-wrapper">

            <img
              src={mainImage || "https://via.placeholder.com/400x500?text=No+Image"}
              alt={product.name}
              className="main-image"
            />

            <div className="wishlist-icon-overlay" onClick={toggleWishlist}>
              <FiHeart fill={wishlist ? "currentColor" : "none"} />
            </div>

            <div className="share-icon-overlay" onClick={handleShare}>
              <FiShare2 />
            </div>

            <div className="thumbnail-overlay">
              {product.images?.map((img, i) => {
                const full = `${BASE_URL}${img}`;
                return (
                  <div
                    key={i}
                    className={`thumb-wrapper ${mainImage === full ? "active-thumb" : ""}`}
                    onClick={() => setMainImage(full)}
                  >
                    <img src={full} alt="thumb" />
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* DETAILS */}
        <div className="details-section">
          <h2 className="product-name">{product.name}</h2>
          <h3 className="price-tag">₹{product.price.toLocaleString()}</h3>

          <div className="action-buttons">
            <button className="btn-add" onClick={addToCart}>Add to Cart</button>
            <button className="btn-buy" onClick={buyNow}>Buy Now</button>
          </div>

          {/* SIZE */}
          {product.sizes?.length > 0 && (
            <>
              <h4 className="section-label">Select Size</h4>
              <div className="size-selector">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    className={`size-node ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* DETAILS TEXT */}
          <div className="myntra-details">

            <h4 className="pd-title">PRODUCT DETAILS</h4>
            <ul className="pd-list">
              {product.description?.split(".").map((line, i) =>
                line.trim() && <li key={i}>{line}</li>
              )}
            </ul>

            {product.fabric && (
              <>
                <h4 className="pd-sub">Material & Care</h4>
                <p className="pd-text">{product.fabric}</p>
              </>
            )}

            <h4 className="pd-sub">Specifications</h4>
            <div className="spec-table">
              {product.work && <div className="spec-row"><span>Work</span><span>{product.work}</span></div>}
              {product.fit && <div className="spec-row"><span>Fit</span><span>{product.fit}</span></div>}
              {product.occasion && <div className="spec-row"><span>Occasion</span><span>{product.occasion}</span></div>}
            </div>

          </div>

        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="related-section">
          <h2 className="related-title">You May Also Like</h2>
          <div className="related-scroll-container">
            {related.map(item => (
              <div
                key={item._id}
                className="related-card"
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="card-img-container">
                  <img
                    src={`${BASE_URL}${item.images?.[0]}`}
                    alt={item.name}
                  />
                </div>
                <div className="related-info">
                  <h4>{item.name}</h4>
                  <p>₹{item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
