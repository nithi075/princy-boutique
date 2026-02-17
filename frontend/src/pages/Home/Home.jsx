import "./Home.css";
import heroImg from "../../assets/hero-model.jpeg";
import storyImg from "../../assets/story-banner.png";
import Categories from "../categories/categories";
import FeaturedProducts from "../FeaturedProducts/FeaturedProducts";
import NewArrivals from "../../components/NewArrivals/NewArrivals";
import InstagramGallery from "../../components/InstagramGallery/InstagramGallery";
import Reviews from "../../components/Reviews/Reviews";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../api/axios";

export default function Home() {

  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  /* ================= LIVE SEARCH ================= */
  useEffect(() => {

    const timer = setTimeout(async () => {

      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      try {
        const res = await API.get(
          `/products/search?q=${encodeURIComponent(query)}`
        );
        setResults(res.data);
      } catch (err) {
        console.log("Search error:", err.message);
        setResults([]);
      }

    }, 350);

    return () => clearTimeout(timer);

  }, [query]);

  /* ================= CLICK PRODUCT ================= */
  const openProduct = (id) => {
    setQuery("");
    setResults([]);
    navigate(`/product/${id}`);
  };

  return (
    <div className="home">

      {/* ================= SEARCH BAR ================= */}
      <div className="hero-search">

        <input
          type="text"
          placeholder="Search saree, silk, wedding..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        {results.length > 0 && (
          <div className="search-dropdown">
            {results.map(item => (
              <div
                key={item._id}
                className="search-item"
                onClick={() => openProduct(item._id)}
              >
                <img
                  src={
                    item.images?.[0]
                      ? `http://localhost:5000${item.images[0]}`
                      : "https://via.placeholder.com/60x70?text=No+Image"
                  }
                  alt={item.name}
                />

                <div className="search-info">
                  <p>{item.name}</p>
                  <span>₹{Number(item.price || 0).toLocaleString("en-IN")}</span>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>

      {/* ================= HERO ================= */}
      <section className="hero">
        <div className="hero-image">
          <img src={heroImg} alt="model"/>
        </div>

        <div className="hero-content">
          <h1>Elevate Your <br/> Elegance</h1>
          <p>Discover Timeless Ethnic Fashion</p>
          <button onClick={() => navigate("/shop")}>
            Shop Now
          </button>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <Categories/>
      <FeaturedProducts/>

      <section className="story-banner">
        <img src={storyImg} alt="story" className="story-bg"/>
        <div className="story-overlay">
          <h2>Our Story</h2>
          <p>Timeless elegance crafted with love</p>
          <button onClick={() => navigate("/about")}>
            Explore More
          </button>
        </div>
      </section>

      <NewArrivals/>
      <InstagramGallery/>
      <Reviews/>

    </div>
  );
}
