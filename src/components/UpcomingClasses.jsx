import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const categories = ["All", "Yoga", "Cardio", "Strength Training", "Zumba", "Meditation"];

const UpcomingClasses = () => {
  const [classes, setClasses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookingStatus, setBookingStatus] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(null); // Track which class is being booked

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get(
          "https://fitnesshub-5yf3.onrender.com/api/users",
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

  const filteredClasses = classes.filter((cls) => {
    return (
      (selectedCategory === "All" || cls.category.toLowerCase() === selectedCategory.toLowerCase()) &&
      cls.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const handleBookNow = async (cls) => {
    setBookingLoading(cls._id); // Set the current class as loading
    try {
      const bookingData = {
        classId: cls._id,
        trainerId: cls.trainer,
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
    } finally {
      setBookingLoading(null); // Reset loading state after booking
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
      
      {loading && <p className="text-center text-gray-600">Loading classes...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((cls) => (
            <div key={cls._id} className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
              <h3 className="text-lg font-semibold">{cls.title}</h3>
              <div className="w-full flex flex-col justify-between">
                <div className="w-full flex flex-row justify-between">
                  <p className="text-gray-600">
                    <Link to={`/customer/CustomerDashboard/TrainerDetails/${cls.trainer._id}`} className="text-blue-500 hover:underline">
                      {cls.trainer.userName}
                    </Link>
                  </p>
                </div>
                <div className="w-full flex flex-row justify-between">
                  <p className="text-sm text-gray-500">{cls.category}</p>
                  <p className="text-sm text-gray-500">⏳ {cls.duration} mins</p>
                </div>
              </div>
              <div className="mt-4 w-full">
                <button
                  className={`w-full p-2 rounded text-white ${bookingLoading === cls._id ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-green-600"}`}
                  onClick={() => handleBookNow(cls)}
                  disabled={bookingLoading === cls._id}
                >
                  {bookingLoading === cls._id ? "Booking..." : "Book Now"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No classes available.</p>
        )}
      </div>
    </div>
  );
};

export default UpcomingClasses;
