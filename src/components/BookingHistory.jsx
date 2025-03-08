import React, { useState } from "react";
import { Link } from "react-router-dom";
import cardio from "../assets/cardio.png";

// Sample Booking History Data
const bookingHistory = [
  { id: 1, trainer: "Agila", name: "Passport Booking", category: "yoga", duration: "1h 3m", rating: 4, image: cardio },
  { id: 2, trainer: "John Doe", name: "HIIT Workout", category: "cardio", duration: "45m", rating: 5, image: cardio },
  { id: 3, trainer: "Jane Smith", name: "Strength Training", category: "strength", duration: "1h", rating: 3.5, image: cardio },
  { id: 4, trainer: "Mark Wilson", name: "Zumba Dance", category: "zumba", duration: "40m", rating: 4.2, image: cardio },
  { id: 5, trainer: "Emily Brown", name: "Meditation", category: "meditation", duration: "50m", rating: 4.8, image: cardio },
];

// Available Categories for Filtering
const categories = ["All", "Cardio", "Yoga", "Strength", "Zumba", "Meditation"];

const BookingHistory = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Filtered history based on selected category
  const filteredHistory =
    selectedCategory === "All"
      ? bookingHistory
      : bookingHistory.filter((booking) => booking.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-semibold mb-6">Booking History</h2>

      {/* Filter Buttons */}
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

      {/* Booking History List */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((booking) => (
            <div key={booking.id} className="flex flex-row bg-white p-4 rounded-lg shadow-md items-center">
              {/* Left: Trainer Image */}
              <img src={booking.image} alt={booking.name} className="w-24 h-24 rounded-full object-cover border" />

              {/* Middle: Trainer & Event Details */}
              <div className="flex flex-col flex-1 px-4">
                <p className="text-gray-600">
                  <Link to={`/customer/CustomerDashboard/mybookings/TrainerDetails`} className="text-blue-500 hover:underline">
                    {booking.trainer}
                  </Link>
                </p>
                <p className="text-gray-600">{booking.name}</p>
                <p className="text-sm text-gray-500">Duration: {booking.duration}</p>
                <p className="text-sm text-gray-500">Category: {booking.category}</p>
              </div>

              {/* Right: Rating & Feedback */}
              <div className="flex flex-col items-end">
                <p className="text-yellow-500 text-lg">⭐ {booking.rating}/5</p>
                <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Give Feedback
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No history available in this category.</p>
        )}
      </div>
    </div>
  );
};

export default BookingHistory;
