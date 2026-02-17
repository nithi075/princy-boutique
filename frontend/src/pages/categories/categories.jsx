import React from "react";
import "./Categories.css";
import { useNavigate } from "react-router-dom";

/* IMAGES */
import arrivals from "../../assets/arrivals.png";
import jewelry from "../../assets/jewelry.png";
import footwear from "../../assets/footwear.png";
import accessories from "../../assets/accessories.png";
import sarees from "../../assets/sarees.png";
import kurtis from "../../assets/kurtis.png";
import dresses from "../../assets/dresses.png";

/* SMALL TOP CATEGORIES (optional future use) */
const categories = [
  { id: 1, title: "New Arrivals", img: arrivals },
  { id: 2, title: "Jewelry", img: jewelry },
  { id: 3, title: "Footwear", img: footwear },
  { id: 4, title: "Accessories", img: accessories },
];

/* MAIN FEATURED CATEGORIES */
const featuredCategories = [
  { id: 1, title: "Sarees", value: "Saree", img: sarees },
  { id: 2, title: "Kurtis", value: "Kurti", img: kurtis },
  { id: 3, title: "Dresses", value: "Gown", img: dresses }, // special logic
];

const Categories = () => {
  const navigate = useNavigate();

  /* NAVIGATION LOGIC */
  const goToCategory = (categoryValue) => {

    // ⭐ SPECIAL RULE FOR DRESSES
    // show everything except saree & kurti
    if (categoryValue === "Gown") {
      navigate(`/shop?exclude=Saree,Kurti`);
      return;
    }

    // normal categories
    navigate(`/shop?category=${encodeURIComponent(categoryValue)}`);
  };

  return (
    <div className="page-wrapper">

      {/* FEATURED CATEGORY CARDS */}
      <section className="featured-section">
        <div className="featured-container">

          {featuredCategories.map((item) => (
            <div
              className="featured-card"
              key={item.id}
              onClick={() => goToCategory(item.value)}
            >

              <img src={item.img} alt={item.title} />

              <div className="featured-overlay">
                <h3>{item.title}</h3>

                <button
                  className="glass-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToCategory(item.value);
                  }}
                >
                  Shop Now
                </button>

              </div>
            </div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default Categories;
