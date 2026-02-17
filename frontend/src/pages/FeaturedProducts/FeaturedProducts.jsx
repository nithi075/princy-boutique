import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import "./FeaturedProducts.css";

const BASE_URL = "http://localhost:5000";

export default function FeaturedProducts() {

  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* FETCH FEATURED PRODUCTS */
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await API.get("/products", {
          params: { featured: true, limit: 8 } // optional filter from backend
        });

        // SAME STRUCTURE AS SHOP PAGE
        const allProducts = res.data.products || [];

        const featuredOnly = allProducts.filter(
          (p) => p.featured === true
        );

        setProducts(featuredOnly);

      } catch (err) {
        console.error("Featured fetch failed:", err.response?.data || err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <section className="featured">

      <div className="featured-header">
        <h2>Featured Collection</h2>
        <button
          className="featured-viewall"
          onClick={() => navigate("/shop")}
        >
          View All
        </button>
      </div>

      <div className="featured-grid">

        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div className="card skeleton" key={i}>
              <div className="card-img shimmer"></div>
              <div className="card-info">
                <div className="line shimmer"></div>
                <div className="line small shimmer"></div>
              </div>
            </div>
          ))
        ) : products.length === 0 ? (
          <p className="no-products">No featured products found</p>
        ) : (
          products.map(item => {

            const imageUrl = item.images?.length
              ? `${BASE_URL}${item.images[0]}`
              : "https://via.placeholder.com/300x400?text=No+Image";

            return (
              <div
                className="card"
                key={item._id}
                onClick={() => navigate(`/product/${item._id}`)}
              >
                <div className="card-img">
                  <img src={imageUrl} alt={item.name} loading="lazy" />
                </div>

                <div className="card-info">
                  <p>{item.name}</p>
                  <span>
                    ₹{Number(item.price || 0).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            );
          })
        )}

      </div>
    </section>
  );
}
