import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import cardio from "../assets/cardio.png"; // Placeholder image

const categories = ["All", "Yoga", "Cardio", "Strength", "Zumba", "Meditation"];

const UpcomingClasses = () => {
  const [classes, setClasses] = useState([]); // Store fetched classes
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null); // ✅ Track booking status messages

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        console.log("🔹 Checking cookies before request:", document.cookie); // Debugging

        const response = await axios.get(
          "https://fitnesshub-5yf3.onrender.com/api/classes/upcomingclasses",
          { withCredentials: true } // ✅ Ensures cookies are sent
        );

        setClasses(response.data);
        console.log("✅ Classes Fetched:", response.data);
      } catch (err) {
        console.error("❌ Error fetching classes:", err.response?.data || err.message);
        setError("Failed to fetch classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  // ✅ Filter classes based on category selection
  const filteredClasses =
    selectedCategory === "All"
      ? classes
      : classes.filter((cls) => cls.category.toLowerCase() === selectedCategory.toLowerCase());

  console.log("🎯 Filtered Classes:", filteredClasses);

  // ✅ Handle booking action
  const handleBookNow = async (cls) => {
    if (!cls || !cls._id || !cls.trainer || !cls.category ||cls.trainer._id || !cls.price) {
      setBookingStatus({ message: "❌ Missing class details. Unable to book.", type: "error" });
      console.error("❌ Booking failed: Missing class details", cls);
      return;
    }

    try {
      const bookingData = {
        classId: cls._id,
        trainerId: cls.trainer, // Ensure trainerId is sent
        category: cls.category,
        price: cls.price, // Ensure price is present
      };

      console.log("🔹 Sending Booking Data:", bookingData); // Debugging

      const response = await axios.post(
        "https://fitnesshub-5yf3.onrender.com/api/bookings",
        bookingData,
        { withCredentials: true }
      );

      setBookingStatus({ message: response.data.message, type: "success" });
    } catch (err) {
      console.error("❌ Booking failed:", err.response?.data || err.message);
      setBookingStatus({ message: err.response?.data?.message || "Booking failed!", type: "error" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-semibold mb-6">Upcoming Classes</h2>

      {/* ✅ Display Booking Status Messages */}
      {bookingStatus && (
        <div
          className={`mb-4 p-2 text-center rounded ${
            bookingStatus.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {bookingStatus.message}
        </div>
      )}

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
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

      {/* Loading State */}
      {loading && <p className="text-center text-gray-600">Loading classes...</p>}

      {/* Error Message */}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Class Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <div key={cls._id} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
              {/* Image */}
              <img src={cls.image || cardio} alt={cls.title} className="w-32 h-32 object-cover rounded-lg mb-3" />

              {/* Event & Trainer Details */}
              <h3 className="text-lg font-semibold">{cls.title}</h3>
              <div className="flex flex-row w-full justify-between">
                <p className="text-gray-600">
                  <Link
                    to={`/customer/CustomerDashboard/mybookings/TrainerDetails`}
                    className="text-blue-500 hover:underline"
                  >
                    {cls.trainer?.name || "Trainer Info Unavailable"} {/* ✅ Prevents UI crash if trainer is missing */}
                  </Link>
                </p>
                <p className="text-yellow-500">⭐ {cls.rating || "4.5"}/5</p>
              </div>
              <div className="w-full flex flex-row justify-between">
                <p className="text-sm text-gray-500">{cls.category}</p>
                <p className="text-sm text-gray-500">⏳ {cls.duration} mins</p>
              </div>

              {/* Book Now Button */}
              <div className="mt-4 w-full">
                <button
                  className="w-full p-2 bg-blue-500 text-white rounded hover:bg-green-600"
                  onClick={() => handleBookNow(cls)}
                >
                  Book Now
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No classes available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingClasses;
