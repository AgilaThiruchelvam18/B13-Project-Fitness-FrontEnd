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
  const [isSlotBooked, setIsSlotBooked] = useState(false);
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
  const [isProcessing, setIsProcessing] = useState(null); // Track processing payments

  const handlePayment = async (booking) => {
    try {
      if (!booking || !booking.price || !booking._id || !booking.user?._id) {
        console.error("❌ Missing payment details:", booking);
        return;
      }
  
      setIsProcessing(booking._id); // Disable button for this booking
  
      console.log("📌 Sending Payment Request with Data:", {
        amount: booking.price,
        bookingId: booking._id,
        userId: booking.user._id,
      });
  
      const response = await axios.post(
        "https://fitnesshub-5yf3.onrender.com/api/payment/order",
        {
          amount: booking.price,
          bookingId: booking._id,
          userId: booking.user._id,
        },
        { withCredentials: true }
      );
  
      console.log("✅ Payment Order Response:", response.data);
  
      const { order } = response.data;
      const options = {
        key: "rzp_test_yMMQBxrAmvtN8W",
        amount: order.amount,
        currency: order.currency,
        name: "FitnessHub",
        description: "Payment for fitness class",
        order_id: order.id,
        handler: async function (response) {
          console.log("Payment Success:", response);
  
          await axios.post(
            "https://fitnesshub-5yf3.onrender.com/api/payment/verify",
            {
              razorpayOrderId: order.id,
              razorpayPaymentId: response.razorpay_payment_id,
              bookingId: booking._id,
            },
            { withCredentials: true }
          );
  
          // Update the booking state without refresh
          setBookings((prevBookings) =>
            prevBookings.map((b) =>
              b._id === booking._id ? { ...b, paymentStatus: "Paid" } : b
            )
          );
  
          setIsProcessing(null); // Reset loading state
        },
        theme: { color: "#3399cc" },
      };
  
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("❌ Error initiating payment:", error.response?.data || error.message);
      setIsProcessing(null); // Reset loading state in case of failure
    }
  };
  const formatTime = (time) => {
    const [hour, minute] = time.split(":");
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 || 12; // Convert 24-hour to 12-hour format
    return `${formattedHour}:${minute} ${period}`;
  };
  
  // 🔥 Filtered Bookings List
  const filteredBookings = bookings.filter((booking) =>
    (selectedCategory === "All" || booking.category === selectedCategory) &&
    booking.classId.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
console.log("Filtered Bookings:", filteredBookings);
console.log("selected Bookings:", selectedBooking);

const handleRecurrentBooking = async (bookingDate,bookingStartTime,bookingEndTime) => {
 

  try {
    // Define updated recurrent booking details
    const updatedBooking = {
      bookingDate, // Keep the existing date
      bookingStartTime, // Update start time if needed
      bookingEndTime, // Update end time if needed
      // recurrence: selectedBooking.classId.schedule.recurrence, // Keep recurrence details
    };

    // Send update request to backend
    await axios.put(
      `https://fitnesshub-5yf3.onrender.com/api/bookings/${selectedBooking._id}/update`,
      updatedBooking,
      { withCredentials: true }
    );

    // Fetch updated bookings after update
    fetchBookings();

    // Close modal after booking update
    setShowBookingDetails(false);
    setSelectedBooking(null);
    setIsSlotBooked(true);
  } catch (error) {
    console.error("Error updating booking:", error.response?.data?.message || error.message);
  }
};


  return (
    <div className="max-w-6xl mx-auto mt-10 overflow-y-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>

      {/* Search & Filter Section */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                  ⭐ {booking.trainer.ratings.averageRating || "5"}/5
                </p>
              </div>
              <div className="w-full flex flex-row justify-between">
                <p className="text-sm text-gray-500">{booking.category}</p>
                <p className="text-sm text-gray-500">
                  ⏳ {booking.classId.duration} mins
                </p>
                
              </div>
              <div className="m-2">
  {booking.classId.schedule.scheduleType === "Recurrent" ? (
    booking.bookingDate ? (
      // Show specific date if available
      <div>
        <div className="text-gray-600">📅 {new Date(booking.bookingDate)?.toLocaleDateString()}</div>
        <div>
          🕒 {formatTime(booking.bookingStartTime)} - {formatTime(booking.bookingEndTime)}
        </div>
      </div>
    ) : (
      // Show message if multiple sessions exist
      <div>
        <div className="text-gray-600">📅 Multiple Sessions</div>
        <div className="text-blue-500 cursor-pointer">Check Available Time Slots</div>
      </div>
    )
  ) : (
    // Handle One-time booking
    <div>
      <div className="text-gray-600">
        📅 {new Date(booking.classId.schedule?.oneTimeDate)?.toLocaleDateString()}
      </div>
      <div>
        🕒 {formatTime(booking.classId.schedule?.oneTimeStartTime)} - {formatTime(booking.classId.schedule?.oneTimeEndTime)}
      </div>
    </div>
  )}
</div>


              {/* Buttons */}
              <div className="mt-4 flex flex-col justify-between gap-2 w-full">
              <button
  className={`w-full p-2 text-white rounded ${
    booking.paymentStatus === "Paid"
      ? "bg-gray-500 cursor-not-allowed"
      : "bg-green-500 hover:bg-green-700"
  }`}
  onClick={() => handlePayment(booking)}
  disabled={booking.paymentStatus === "Paid" || isProcessing === booking._id}
>
  {isProcessing === booking._id ? "Processing..." : booking.paymentStatus === "Paid" ? "Paid" : "Pay Now"}
</button>

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
                {/* <button className="w-full p-2 bg-green-400 text-white rounded hover:bg-yellow-600">
                  Reschedule
                </button> */}
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
{/* 🔍 Booking Details Modal */}
{showBookingDetails && selectedBooking && (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 ">
    <div className="bg-white  rounded-lg shadow-lg w-2/3 mt-6 p-8 h-screen overflow-y-auto">
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
      <p className="text-gray-700">
        <strong>Payment Status:</strong> {selectedBooking.paymentStatus}
      </p>

      {/* 🔥 Show Schedule Details */}
   
    <div className="bg-white p-6 rounded-lg ">
        <h4 className="text-md font-semibold">Trainer Schedule</h4>
        
        {selectedBooking.classId.schedule.scheduleType === "Recurrent" ? (
          <div className="mt-2 ">
            <p className="text-sm text-gray-600">📅 Recurrent Schedule</p>
            <div className="grid grid-cols-6 gap-6 text-center ">
              {selectedBooking.classId.schedule.timeSlots.map((slot, index) => (
                <div key={index} className="text-gray-700 bg-gray-100 rounded-lg shadow-lg p-2">
                  <div className="flex flex-col">
                    <div>🕒 {new Date(slot.date).toLocaleDateString()}-{slot.day}</div>
                  <div> {formatTime(slot.startTime)} - {formatTime(slot.endTime)}</div>
                 <div> <button className="px-2 py-2 bg-blue-500"  onClick={() => {
handleRecurrentBooking(slot.date,slot.startTime,slot.endTime)
   // Navigate back to My Bookings
        }}>Book</button></div>
                 </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-2">
            <p className="text-sm text-gray-600">📅 One-Time Schedule</p>
            <p className="text-gray-700">
              {new Date(selectedBooking.classId.schedule.oneTimeDate).toLocaleDateString()}
            </p>
            <p className="text-gray-700">
              🕒 {formatTime(selectedBooking.classId.schedule.oneTimeStartTime)} - {formatTime(selectedBooking.classId.schedule.oneTimeEndTime)}
            </p>
          </div>
        )}
      </div>

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
