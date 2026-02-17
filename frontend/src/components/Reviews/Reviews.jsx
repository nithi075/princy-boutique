import { useState, useEffect } from "react";
import "./Reviews.css";
import { FaStar } from "react-icons/fa";
import API from "../../api/axios";

export default function Reviews() {

  const [allReviews, setAllReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [name, setName] = useState("");
  const [showForm, setShowForm] = useState(false);

  /* ---------------- FETCH REVIEWS ---------------- */
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const { data } = await API.get("/reviews");
      setAllReviews(data);
    } catch (err) {
      console.log("Failed to load reviews");
    }
  };

  /* ---------------- SUBMIT REVIEW ---------------- */
  const handleSubmit = async () => {
    if (!reviewText || rating === 0 || !name) {
      alert("Please enter name, review and rating");
      return;
    }

    try {
      const { data } = await API.post("/reviews", {
        name,
        text: reviewText,
        stars: rating,
      });

      // add new review top
      setAllReviews([data, ...allReviews]);

      alert("Review Submitted Successfully ❤️");

      setReviewText("");
      setRating(0);
      setName("");
      setShowForm(false);

    } catch (err) {
      alert("Server error while submitting review");
    }
  };

  return (
    <section className="reviews-section">

      <div className="reviews-header">
        <p className="reviews-sub">Princy Boutique</p>
        <h2>What Our Customers Say</h2>
      </div>

      <div className="reviews-slider">
        {allReviews.map((item) => (
          <div key={item._id} className="review-card">
            <h4>{item.name}</h4>

            <div className="stars">
              {[...Array(item.stars)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>

            <p>{item.text}</p>
          </div>
        ))}
      </div>

      <div className="review-toggle">
        <button onClick={() => setShowForm(!showForm)} className="toggle-btn">
          {showForm ? "Close Review Form" : "Write a Review"}
        </button>
      </div>

      <div className={`write-review ${showForm ? "open" : ""}`}>
        <h3>Write a Review</h3>

        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="name-input"
        />

        <div className="star-input">
          {[...Array(5)].map((_, index) => {
            const value = index + 1;
            return (
              <FaStar
                key={index}
                className="star"
                color={value <= (hover || rating) ? "#d6a46d" : "#ddd"}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
              />
            );
          })}
        </div>

        <textarea
          placeholder="Write your review..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
        />

        <button onClick={handleSubmit}>Submit Review</button>
      </div>

    </section>
  );
}
