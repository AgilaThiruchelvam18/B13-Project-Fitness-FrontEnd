import React, { useState, useEffect } from "react";
import axios from "axios";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Yoga",
    duration: 60,
    timeSlots: "",
    capacity: "",
    price: "",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await axios.get(
      "https://fitnesshub-5yf3.onrender.com/api/classes",
      { withCredentials: true } // ✅ Ensures JWT is sent with request
    );
    setClasses(res.data);
  };

  const handleChange = (e) => {
    if (e.target.name === "timeSlots") {
      setFormData({
        ...formData,
        timeSlots: e.target.value.split(",").map((slot) => {
          const [day, time] = slot.trim().split(" ");
          return { day, time };
        }),
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "https://fitnesshub-5yf3.onrender.com/api/classes",
      formData,
      { withCredentials: true } // ✅ Ensures JWT is sent with request
    );
    fetchClasses();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-black">Manage Classes</h2>
      <form onSubmit={handleSubmit} className="grid gap-4">
        <input type="text" name="title" placeholder="Class Title" onChange={handleChange} required className="p-2 border rounded" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="p-2 border rounded"></textarea>
        <select name="category" onChange={handleChange} className="p-2 border rounded">
          <option value="Yoga">Yoga</option>
          <option value="Strength Training">Strength Training</option>
          <option value="Cardio">Cardio</option>
          <option value="Meditation">Meditation</option>
          <option value="Zumba">Zumba</option>
          <option value="Nutrition">Nutrition</option>
        </select>
        <input type="number" name="duration" placeholder="Duration (minutes)" onChange={handleChange} required className="p-2 border rounded" />
        <input type="text" name="timeSlots" placeholder="Time Slots (e.g., Mon 10 AM, Wed 6 PM)" onChange={handleChange} className="p-2 border rounded" />
        <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} required className="p-2 border rounded" />
        <input type="number" name="price" placeholder="Price ($)" onChange={handleChange} required className="p-2 border rounded" />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Class</button>
      </form>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Your Classes</h3>
        <ul>
          {classes.map((cls) => (
            <li key={cls._id} className="border p-3 rounded mb-2">
              <p className="font-semibold">{cls.title} ({cls.category})</p>
              <p>{cls.description}</p>
              <p>Duration: {cls.duration} min | Price: ${cls.price}</p>
              <p>Capacity: {cls.capacity} participants</p>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {cls.timeSlots.map((slot, index) => (
                  <div key={index} className="bg-gray-200 p-2 rounded text-center">
                    <p className="font-medium">{slot.day}</p>
                    <p>{slot.time}</p>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Classes;
