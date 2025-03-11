import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import cardio from "../assets/cardio.png"; // Placeholder image

const categories = ["All", "Yoga", "Cardio", "Strength", "Zumba", "Meditation"];

const UpcomingClasses = () => {
  const [classes, setClasses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "https://fitnesshub-5yf3.onrender.com/api/classes/upcomingclasses",
          { withCredentials: true }
        );
        setClasses(response.data);
      } catch (err) {
        setError("Failed to fetch classes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const filteredClasses =
    selectedCategory === "All"
      ? classes
      : classes.filter((cls) => cls.category.toLowerCase() === selectedCategory.toLowerCase());

  // ✅ FIX: Use `cls.trainer` directly (since it contains an ID string)
  const handleBookNow = async (cls) => {
    if (!cls || !cls._id || !cls.trainer || !cls.category || !cls.price) {
      setBookingStatus({ message: "❌ Missing class details. Unable to book.", type: "error" });
      return;
    }

    try {
      const bookingData = {
        classId: cls._id,
        trainerId: cls.trainer, // ✅ FIXED: Directly using `cls.trainer` (trainer ID string)
        category: cls.category,
        price: cls.price,
      };

      const response = await axios.post(
        "https://fitnesshub-5yf3.onrender.com/api/bookings",
        bookingData,
        { withCredentials: true }
      );

      setBookingStatus({ message: response.data.message, type: "success" });
    } catch (err) {
      setBookingStatus({ message: err.response?.data?.message || "Booking failed!", type: "error" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-semibold mb-6">Upcoming Classes</h2>

      {bookingStatus && (
        <div className={`mb-4 p-2 text-center rounded ${bookingStatus.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {bookingStatus.message}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)} className={`px-4 py-2 rounded-md text-sm font-semibold ${selectedCategory === category ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
            {category}
          </button>
        ))}
      </div>

      {loading && <p className="text-center text-gray-600">Loading classes...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <div key={cls._id} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
              <img src={cls.image || cardio} alt={cls.title} className="w-32 h-32 object-cover rounded-lg mb-3" />
              <h3 className="text-lg font-semibold">{cls.title}</h3>
              <p className="text-sm text-gray-500">{cls.category}</p>
              <p className="text-sm text-gray-500">⏳ {cls.duration} mins</p>
              <div className="mt-4 w-full">
                <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-green-600" onClick={() => handleBookNow(cls)}>
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
