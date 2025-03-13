import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

// Categories & Status Filters
const categories = ["All", "Cardio", "Yoga", "Strength Training", "Zumba", "Meditation"];
const statusFilters = ["All", "Active", "Completed", "Cancelled"];

const BookingHistory = () => {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Fetch Booking History from API
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

  // Apply Category and Status Filters
  const filteredHistory = bookingHistory.filter((booking) => {
    const categoryMatch = selectedCategory === "All" || booking.category.toLowerCase() === selectedCategory.toLowerCase();
    const statusMatch = selectedStatus === "All" || booking.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 rounded-lg shadow-lg bg-gray-50 h-screen overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6">Booking History</h2>

      {/* Filter Container */}
      <div className="flex justify-between items-center mb-6">
        {/* Left: Category Filter Buttons */}
        <div className="flex flex-wrap gap-3">
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

        {/* Right: Status Filter Dropdown */}
        <div>
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
      </div>

      {/* Booking History List */}
      <div className="grid grid-cols-1 gap-4 p-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((booking) => (
            <div
              key={booking._id}
              className="flex flex-row justify-between bg-white p-4 rounded-lg shadow-md items-center border-l-4"
              style={{
                borderColor:
                  booking.status === "Completed" ? "#10B981" : booking.status === "Cancelled" ? "#EF4444" : "#3B82F6",
              }}
            >
              {/* Left: Booking Details */}
              <div className="flex flex-col px-4">
                <p className="text-gray-600 font-semibold">{booking.classId.title}</p>
                <p className="text-sm text-gray-500">
                  Trainer:{" "}
                  <Link to={`/customer/CustomerDashboard/TrainerDetails/${booking.trainer._id}`} className="text-blue-500 hover:underline">
                    {booking.trainer.userName}
                  </Link>
                </p>
                <p className="text-sm text-gray-500">Duration: {booking.classId.duration} mins</p>
                <p className="text-sm text-gray-500">Category: {booking.category}</p>
              </div>

              {/* Middle: Status Badge */}
              <div
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  booking.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : booking.status === "Cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {booking.status}
              </div>

              {/* Right: Rating & Feedback (Only for Completed) */}
              {/* {booking.status === "Completed" ? (
                <div className="flex flex-col items-center">
                  <p className="text-yellow-500 text-lg">⭐ {booking.trainer.ratings.averageRating || "N/A"}/5</p>
                  <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Give Feedback
                  </button>
                </div>
              ) 
              : (
                <div className="text-red-500 font-semibold">Cancelled</div>
              )} */}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No history available in this category.</p>
        )
        }
      </div>
    </div>
  );
};

export default BookingHistory;
