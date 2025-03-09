import React, { useEffect, useState } from "react";
import axios from "axios";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("https://fitnesshub-5yf3.onrender.com/api/bookings",{ withCredentials: true });
      setBookings(res.data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Bookings</h2>
      <ul>
        {bookings.map((b) => (
          <li key={b._id}>
            {b.user.name} - {b.class.title} ({b.date})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Bookings;
