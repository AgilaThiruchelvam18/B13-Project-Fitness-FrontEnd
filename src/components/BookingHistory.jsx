import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const categories = ["All", "Cardio", "Yoga", "Strength Training", "Zumba", "Meditation"];
const statusFilters = ["All", "Booked", "Completed", "Cancelled"];

const BookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    const fetchBookingHistory = async () => {
      try {
        const res = await axios.get("https://fitnesshub-5yf3.onrender.com/api/bookings", { withCredentials: true });
        setBookingHistory(res.data);
      } catch (err) {
        console.error("Error fetching booking history:", err);
      }
    };
    fetchBookingHistory();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get("https://fitnesshub-5yf3.onrender.com/api/reviews", { withCredentials: true });
        console.log(res.data);
        const reviewsData = res.data.reduce((acc, review) => {
          acc[review.booking] = { rating: review.rating, comment: review.comment, submitted: true };
          return acc;
        }, {});
        setReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (bookingId, trainerId) => {
    try {
      const { rating, comment } = reviews[bookingId] || {};
      if (!rating || !comment) {
        alert("Please provide a rating and review");
        return;
      }

      const res = await axios.post(
        "https://fitnesshub-5yf3.onrender.com/api/reviews",
        { bookingId, trainerId, rating, comment },
        { withCredentials: true }
      );

      setReviews((prevReviews) => ({
        ...prevReviews,
        [bookingId]: { rating: res.data.review.rating, comment: res.data.review.comment, submitted: true },
      }));

      alert("Review submitted successfully!");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review");
    }
  };

  const handleReviewChange = (bookingId, field, value) => {
    setReviews((prevReviews) => ({
      ...prevReviews,
      [bookingId]: {
        ...prevReviews[bookingId],
        [field]: value,
      },
    }));
  };

  const filteredBookings = bookingHistory.filter(
    (booking) =>
      (selectedCategory === "All" || booking.category === selectedCategory) &&
      (selectedStatus === "All" || booking.status === selectedStatus) &&
      booking.classId?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 rounded-lg shadow-lg bg-gray-50 h-screen overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Booking History</h2>
        <input
          type="text"
          placeholder="Search by class title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border rounded-md text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
        >
          {statusFilters.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking._id}
            className="bg-white p-4 rounded-lg shadow-md border-l-4"
            style={{
              borderColor:
                booking.status === "Completed"
                  ? "#10B981"
                  : booking.status === "Cancelled"
                  ? "#EF4444"
                  : "#3B82F6",
            }}
          >
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-col">
              <p className="text-gray-600 font-semibold">{booking.classId?.title || "Unknown Class"}</p>
              <p className="text-sm text-gray-500">
                Trainer:{" "}
                <Link to={`/customer/CustomerDashboard/TrainerDetails/${booking.trainer?._id}`} className="text-blue-500 hover:underline">
                  {booking.trainer?.userName || "Unknown Trainer"}
                </Link>
              </p>
              <p className="text-sm text-gray-500">Duration: {booking.classId?.duration || "-"} mins</p>
              <p className="text-sm text-gray-500">Category: {booking.category}</p>
              <p className="text-sm font-bold"></p>
              </div>
                <div
                  className={`px-2 py-1 rounded-md text-white ${
                    booking.status === "Completed"
                      ? "bg-green-500"
                      : booking.status === "Cancelled"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                >
                  {booking.status}
                </div>
               
            </div>

            {booking.status === "Completed" && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Review</h3>
                {reviews[booking._id]?.submitted ? (
                  <div className="mt-2 p-3 bg-gray-100 rounded-md">
                    <p className="font-semibold">Rating: {reviews[booking._id].rating} ⭐</p>
                    <p>{reviews[booking._id].comment}</p>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center gap-2">
                    <select
                      value={reviews[booking._id]?.rating || ""}
                      onChange={(e) => handleReviewChange(booking._id, "rating", e.target.value)}
                      className="border px-2 py-1 rounded-md"
                    >
                      <option value="">Rate</option>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <option key={star} value={star}>
                          {star} ⭐
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Write a review..."
                      value={reviews[booking._id]?.comment || ""}
                      onChange={(e) => handleReviewChange(booking._id, "comment", e.target.value)}
                      className="border px-4 py-2 rounded-md"
                    />
                    <button
                      onClick={() => handleReviewSubmit(booking._id, booking.trainer?._id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
