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
      console.log("Bookings:", bookings);
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
      setSelectedBooking(null);
    } catch (error) {
      console.error(
        "Error canceling booking:",
        error.response?.data?.message || error.message
      );
    }
  };
  const handlePayment = async (booking) => {
    try {
      const response = await axios.post(
        "https://fitnesshub-5yf3.onrender.com/api/payment/order",
        { amount: booking.classId.price, bookingId: booking._id },
        { withCredentials: true }
      );
  
      const { order } = response.data;
  
      const options = {
        key: "YOUR_RAZORPAY_KEY_ID", // Replace with actual key
        amount: order.amount,
        currency: order.currency,
        name: "Fitness Hub",
        description: `Payment for ${booking.classId.title}`,
        order_id: order.id,
        handler: async (response) => {
          try {
            await axios.post(
              "https://fitnesshub-5yf3.onrender.com/api/payment/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking._id,
              },
              { withCredentials: true }
            );
  
            alert("Payment successful! Your booking is confirmed.");
            fetchBookings();
          } catch (error) {
            console.error("Payment verification failed:", error);
            alert("Payment failed! Please try again.");
          }
        },
        prefill: {
          name: booking.user.userName,
          email: booking.user.email,
        },
        theme: { color: "#3399cc" },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Error processing payment. Please try again.");
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
              <div className="mt-4 flex flex-col justify-between gap-2 w-full">
                <div>
                <button
  className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-700"
  onClick={() => handlePayment(booking)}
>
  Pay Now
</button>

                </div>
                <div className="flex flex-row">

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

      {/* ❗ Confirmation Modal for Canceling Booking */}
      {showCancelConfirm &&(
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Cancel Booking?
            </h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to cancel{" "}
              <strong>{selectedBooking.classId.title}</strong>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                No
              </button>
              <button
                onClick={handleCancelBooking}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🔍 Booking Details Modal */}
{showBookingDetails && selectedBooking && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Booking Details
      </h3>
      <p className="text-gray-700">
        <strong>Class:</strong> {selectedBooking.classId.title}
      </p>
      <p className="text-gray-700">
        <strong>Trainer:</strong>{" "}
        <Link
          to={`/customer/CustomerDashboard/TrainerDetails/${selectedBooking.trainer._id}`}
          className="text-blue-500 hover:underline"
        >
          {selectedBooking.trainer.userName}
        </Link>
      </p>
      <p className="text-gray-700">
        <strong>Category:</strong> {selectedBooking.category}
      </p>
      <p className="text-gray-700">
        <strong>Duration:</strong> {selectedBooking.classId.duration} mins
      </p>
      <p className="text-gray-700">
        <strong>Status:</strong> {selectedBooking.status}
      </p>

      {/* Close Button */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowBookingDetails(false)}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
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
