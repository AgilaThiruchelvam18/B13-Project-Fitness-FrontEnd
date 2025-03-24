import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainerReviews = ({ trainerId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0); // Rating state (1-5)
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`https://fitnesshub-5yf3.onrender.com/api/reviews/${trainerId}`);
        setReviews(res.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, [trainerId]);

  const handleRatingClick = (star) => {
    setRating(star);
  };

  const submitReview = async () => {
    if (!rating || !comment) {
      alert("Please provide a rating and a review.");
      return;
    }

    try {
      const res = await axios.post(
        "https://fitnesshub-5yf3.onrender.com/api/reviews",
        { trainerId, rating, comment },
        { withCredentials: true }
      );

      if (res.data) {
        setReviews([...reviews, res.data]);
        setRating(0);
        setComment("");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold">User Reviews</h3>

      {/* Star Rating Input */}
      <div className="flex space-x-2 my-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
            onClick={() => handleRatingClick(star)}
          >
            ★
          </span>
        ))}
      </div>

      {/* Review Input */}
      <textarea
        className="w-full p-2 border rounded-md"
        placeholder="Write a review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>

      <button
        onClick={submitReview}
        className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Submit Review
      </button>

      {/* Display Reviews */}
      <div className="space-y-4 mt-4">
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <div key={index} className="p-4 border rounded-md bg-gray-50">
              <p className="font-semibold">{review.userName}</p>
              <p className="text-yellow-500">{Array(review.rating).fill("⭐").join("")}</p>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </div>
    </div>
  );
};

export default TrainerReviews;
