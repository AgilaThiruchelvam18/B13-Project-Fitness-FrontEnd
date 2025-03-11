import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import cardio from "../assets/cardio.png"; // Default image

const categories = ["All", "Cardio", "Yoga", "Strength", "Zumba", "Meditation"];

const MyBookings = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔥 1️⃣ **Fetch Logged-in User's Bookings**
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);

        // ✅ API call to fetch bookings (HTTP-only cookie will be sent automatically)
        const response = await axios.get("https://fitnesshub-5yf3.onrender.com/api/bookings", {
          withCredentials: true, // 👈 Ensures HTTP-only cookies are sent
        });
console.log("Bookings",response.data);
        setBookings(response.data); // ✅ Update state with user's bookings
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // 🔥 2️⃣ **Filter bookings based on category**
  const filteredBookings =
    selectedCategory === "All"
      ? bookings
      : bookings.filter((booking) => booking.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto mt-10 overflow-y-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>

      {/* 🔥 3️⃣ **Filter Buttons** */}
      <div className="flex flex-wrap gap-3 mb-6">
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

      {/* 🔥 4️⃣ **Handle Loading & Errors** */}
      {loading && <p className="text-center text-gray-600">Loading bookings...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* 🔥 5️⃣ **Bookings Grid** */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
              {/* Image */}
              <img src={booking.image || cardio} alt={booking.name} className="w-32 h-32 object-cover rounded-lg mb-3" />

              {/* Event & Trainer Details */}
              <h3 className="text-lg font-semibold">{booking.name}</h3>
              <div className="flex flex-row w-full justify-between">
                <p className="text-gray-600">
                  <Link to={`/customer/CustomerDashboard/TrainerDetails/${booking.trainerId}`} className="text-blue-500 hover:underline">
                    {booking.trainer}
                  </Link>
                </p>
                <p className="text-yellow-500">⭐ {booking.rating || "N/A"}/5</p>
              </div>
              <div className="w-full flex flex-row justify-between">
                <p className="text-sm text-gray-500">{booking.category}</p>
                <p className="text-sm text-gray-500">⏳ {booking.duration}</p>
              </div>

              {/* Buttons */}
              <div className="mt-4 flex justify-between gap-2 w-full">
                <button className="w-full p-2 bg-blue-400 text-white rounded hover:bg-blue-600">View</button>
                <button className="w-full p-2 bg-green-400 text-white rounded hover:bg-yellow-600">Reschedule</button>
                <button className="w-full p-2 bg-red-400 text-white rounded hover:bg-red-600">Cancel</button>
              </div>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-gray-600 col-span-full">No bookings available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
