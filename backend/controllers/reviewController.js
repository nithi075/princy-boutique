import Review from "../models/Review.js";

/* ---------------- GET ALL REVIEWS ---------------- */
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

/* ---------------- ADD REVIEW ---------------- */
export const addReview = async (req, res) => {
  try {
    const { name, text, stars } = req.body;

    if (!name || !text || !stars) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const review = await Review.create({
      name,
      text,
      stars,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Failed to add review" });
  }
};

/* ---------------- DELETE REVIEW (optional admin) ---------------- */
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();

    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete review" });
  }
};
