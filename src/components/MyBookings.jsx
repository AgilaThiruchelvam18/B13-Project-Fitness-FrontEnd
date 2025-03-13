import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const categories = ["All", "Cardio", "Yoga", "Strength Training", "Zumba", "Meditation"];

const MyBookings = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // Fetch Bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://fitnesshub-5yf3.onrender.com/api/bookings",
        { withCredentials: true }
      );

      const activeBookings = response.data.filter(
        (booking) => booking.status !== "Cancelled"
      );
      setBookings(activeBookings);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel Booking
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      await axios.put(
        `https://fitnesshub-5yf3.onrender.com/api/bookings/${selectedBooking._id}/cancel`,
        {},
        { withCredentials: true }
      );

      fetchBookings();
      setShowCancelConfirm(false);
    } catch (error) {
      console.error(
        "Error canceling booking:",
        error.response?.data?.message || error.message
      );
    }
  };

  // 🔥 Filtered Bookings List
  const filteredBookings = bookings.filter((booking) =>
    (selectedCategory === "All" || booking.category === selectedCategory) &&
    booking.classId.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto mt-10 overflow-y-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>

      {/* Search & Filter Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="flex gap-3">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-semibold ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search by class title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border px-4 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Loading & Error Handling */}
      {loading && <p className="text-center text-gray-600">Loading bookings...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Bookings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
            >
              <h3 className="text-lg font-semibold">{booking.classId.title}</h3>
              <div className="flex flex-row w-full justify-between">
                <p className="text-gray-600">
                  <Link
                    to={`/customer/CustomerDashboard/TrainerDetails/${booking.trainer._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    {booking.trainer.userName}
                  </Link>
                </p>
                <p className="text-yellow-500 text-md">
                  ⭐ {booking.trainer.ratings.averageRating || "N/A"}/5
                </p>
              </div>
              <div className="w-full flex flex-row justify-between">
                <p className="text-sm text-gray-500">{booking.category}</p>
                <p className="text-sm text-gray-500">
                  ⏳ {booking.classId.duration} mins
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex justify-between gap-2 w-full">
                <button
                  className="w-full p-2 bg-blue-400 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowBookingDetails(true);
                  }}
                >
                  View
                </button>
                <button className="w-full p-2 bg-green-400 text-white rounded hover:bg-yellow-600">
                  Reschedule
                </button>
                <button
                  onClick={() => {
                    setSelectedBooking(booking);
                    setShowCancelConfirm(true);
                  }}
                  className="w-full p-2 bg-red-400 text-white rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))
        ) : (
          !loading && (
            <p className="text-center text-gray-600 col-span-full">
              No bookings available in this category.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default MyBookings;