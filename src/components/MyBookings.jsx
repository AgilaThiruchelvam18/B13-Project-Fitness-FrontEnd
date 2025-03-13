import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const categories = ["All", "Cardio", "Yoga", "Strength", "Zumba", "Meditation"];

const MyBookings = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showBookingDetails, setShowBookingDetails] = useState(false);

  // 🔥 Fetch Bookings Function
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://fitnesshub-5yf3.onrender.com/api/bookings", {
        withCredentials: true,
      });

      console.log("API Response:", response.data);

      // ✅ Only store **active** bookings
      const activeBookings = response.data.filter((booking) => booking.status !== "Cancelled");
      console.log("Active Bookings:", activeBookings);

      setBookings(activeBookings);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Fetch Logged-in User's Bookings on Mount
  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔥 Track selectedBooking updates
  useEffect(() => {
    console.log("Updated selectedBooking:", selectedBooking);
  }, [selectedBooking]);

  // 🔥 Cancel Booking & Refresh Data
  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      await axios.put(
        `https://fitnesshub-5yf3.onrender.com/api/bookings/${selectedBooking._id}/cancel`,
        {},
        { withCredentials: true }
      );

      // ✅ Re-fetch bookings to update UI
      fetchBookings();
      setShowCancelConfirm(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error("Error canceling booking:", error.response?.data?.message || error.message);
    }
  };

  console.log("showBookingDetails", showBookingDetails);
  console.log("selectedBooking", selectedBooking);
  console.log("bookings", bookings);

  return (
    <div className="max-w-6xl mx-auto mt-10 overflow-y-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>

      {/* 🔥 Filter Buttons */}
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
      </div>

      {/* 🔥 Loading & Error Handling */}
      {loading && <p className="text-center text-gray-600">Loading bookings...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 🔥 Bookings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold">{booking.classId?.title || "Unknown Class"}</h3>
              <div className="flex flex-row w-full justify-between">
                <p className="text-gray-600">
                  <Link to={`/customer/CustomerDashboard/TrainerDetails/${booking.trainer?._id || ""}`} className="text-blue-500 hover:underline">
                    {booking.trainer?.userName || "Unknown Trainer"}
                  </Link>
                </p>
                <p className="text-yellow-500 text-md">⭐ {booking.trainer?.ratings?.averageRating || "N/A"}/5</p>
              </div>
              <div className="w-full flex flex-row justify-between">
                <p className="text-sm text-gray-500">{booking.category}</p>
                <p className="text-sm text-gray-500">⏳ {booking.classId?.duration || "N/A"} mins</p>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex justify-between gap-2 w-full">
                <button
                  className="w-full p-2 bg-blue-400 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    console.log("Booking clicked:", booking);
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
          !loading && <p className="text-center text-gray-600 col-span-full">No bookings available in this category.</p>
        )}
      </div>

      {/* 🔥 Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-3xl font-semibold m-2">{selectedBooking.classId?.title || "Unknown Class"}</h3>
            <p className="text-gray-600 text-lg">Description: {selectedBooking.classId?.description || "N/A"}</p>
            <p className="text-gray-600 text-lg">Trainer: {selectedBooking.trainer?.userName || "N/A"}</p>
            <p className="text-gray-600 text-lg">Category: {selectedBooking.category}</p>
            <p className="text-gray-600 text-lg">Duration: {selectedBooking.classId?.duration || "N/A"} mins</p>
            <p className="text-gray-600 text-lg">Date: {selectedBooking.classId?.timeSlots?.[0]?.date || "N/A"}</p>
            <p className="text-gray-600 text-lg">Time: {selectedBooking.classId?.timeSlots?.[0]?.time || "N/A"}</p>
            <p className="text-gray-600 text-lg">Capacity: {selectedBooking.classId?.capacity || "N/A"}</p>
            <p className="text-gray-600 text-lg">Price: ${selectedBooking.price}</p>

            <div className="flex justify-end mt-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                onClick={() => setShowBookingDetails(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
