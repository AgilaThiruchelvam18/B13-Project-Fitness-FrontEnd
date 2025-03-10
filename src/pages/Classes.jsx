import React, { useState, useEffect } from "react";
import axios from "axios";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Yoga",
    duration: 60,
    timeSlots: [],
    capacity: "",
    price: "",
  });
  const [slotData, setSlotData] = useState({
    date: "",
    day: "",
    amPm: "AM",
    month: "",
    weekStart: "",
    weekEnd: "",
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await axios.get(
      "https://fitnesshub-5yf3.onrender.com/api/classes",
      { withCredentials: true }
    );
    setClasses(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSlotChange = (e) => {
    const { name, value } = e.target;
    setSlotData((prev) => ({ ...prev, [name]: value }));
  };

  const addTimeSlot = () => {
    setTimeSlots([...timeSlots, slotData]);
    setFormData({ ...formData, timeSlots: [...timeSlots, slotData] });
    setSlotData({ date: "", day: "", amPm: "AM", month: "", weekStart: "", weekEnd: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(
      "https://fitnesshub-5yf3.onrender.com/api/classes",
      formData,
      { withCredentials: true }
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
        <input type="number" name="capacity" placeholder="Capacity" onChange={handleChange} required className="p-2 border rounded" />
        <input type="number" name="price" placeholder="Price ($)" onChange={handleChange} required className="p-2 border rounded" />
      </form>

      <h3 className="text-xl font-semibold mt-6">Add Time Slots</h3>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <input type="text" name="date" placeholder="Date" value={slotData.date} onChange={handleSlotChange} className="p-2 border rounded" />
        <input type="text" name="day" placeholder="Day" value={slotData.day} onChange={handleSlotChange} className="p-2 border rounded" />
        <select name="amPm" value={slotData.amPm} onChange={handleSlotChange} className="p-2 border rounded">
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
        <input type="text" name="month" placeholder="Month" value={slotData.month} onChange={handleSlotChange} className="p-2 border rounded" />
        <input type="text" name="weekStart" placeholder="Week Start Date" value={slotData.weekStart} onChange={handleSlotChange} className="p-2 border rounded" />
        <input type="text" name="weekEnd" placeholder="Week End Date" value={slotData.weekEnd} onChange={handleSlotChange} className="p-2 border rounded" />
      </div>
      <button onClick={addTimeSlot} className="mt-4 p-2 bg-blue-500 text-white rounded">Add Time Slot</button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Selected Time Slots:</h3>
        <div className="grid grid-cols-3 gap-4 mt-2">
          {timeSlots.map((slot, index) => (
            <div key={index} className="p-3 border rounded shadow">
              <p>{slot.date}, {slot.day}, {slot.amPm}</p>
              <p>{slot.month} - {slot.weekStart} to {slot.weekEnd}</p>
            </div>
          ))}
        </div>
      </div>

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
