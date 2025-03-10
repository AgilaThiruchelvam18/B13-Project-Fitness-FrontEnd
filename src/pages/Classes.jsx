import { useState, useEffect } from "react";
import axios from "axios";

const Classes = () => {
  const [classes, setClasses] = useState([]); // Store created events
  const [formData, setFormData] = useState({
    title: "",
    trainer: localStorage.getItem("trainerId") || "", // Dynamically set trainer ID
    description: "",
    category: "",
    duration: "",
    capacity: "",
    price: "",
    timeSlot: {
      date: "",
      time: "",
      recurrence: "one-time",
      recurrenceDetails: {
        daily: { startDate: "", endDate: "" },
        weekly: [],
        monthly: { type: "daily", specificDay: "" },
      },
    },
  });

  useEffect(() => {
    fetchClasses(); // Fetch created events on page load
  }, []);

  const fetchClasses = async () => {
    try {
      const res =await axios.get("https://fitnesshub-5yf3.onrender.com/api/classes", { 
        withCredentials: true // ✅ Ensures cookies are sent for authentication
      });
      setClasses(res.data);
    } catch (err) {
      console.error("Error fetching classes", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeSlotChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      timeSlot: { ...prev.timeSlot, [name]: value },
    }));
  };

  const handleRecurrenceChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      timeSlot: {
        ...prev.timeSlot,
        recurrence: value,
        recurrenceDetails: {
          daily: { startDate: "", endDate: "" },
          weekly: [],
          monthly: { type: "daily", specificDay: "" },
        },
      },
    }));
  };

  const handleWeeklySelection = (day) => {
    setFormData((prev) => {
      const updatedWeekly = prev.timeSlot.recurrenceDetails.weekly.includes(day)
        ? prev.timeSlot.recurrenceDetails.weekly.filter((d) => d !== day)
        : [...prev.timeSlot.recurrenceDetails.weekly, day];

      return {
        ...prev,
        timeSlot: {
          ...prev.timeSlot,
          recurrenceDetails: { ...prev.timeSlot.recurrenceDetails, weekly: updatedWeekly },
        },
      };
    });
  };

  const handleCreateClass = async () => {
    try {
      const res = await axios.get("https://fitnesshub-5yf3.onrender.com/api/classes", formData ,{ 
        withCredentials: true // ✅ Ensures cookies are sent for authentication
      });
      setClasses([...classes, res.data]);
      setFormData({
        title: "",
        trainer: localStorage.getItem("trainerId") || "",
        description: "",
        category: "",
        duration: "",
        capacity: "",
        price: "",
        timeSlot: {
          date: "",
          time: "",
          recurrence: "one-time",
          recurrenceDetails: {
            daily: { startDate: "", endDate: "" },
            weekly: [],
            monthly: { type: "daily", specificDay: "" },
          },
        },
      });
    } catch (err) {
      console.error("Error creating class", err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create Class</h2>
      <div className="grid grid-cols-2 gap-4">
        <input type="text" name="title" placeholder="Class Title" value={formData.title} onChange={handleChange} className="p-2 border rounded" />
        <input type="text" name="description" placeholder="Class Description" value={formData.description} onChange={handleChange} className="p-2 border rounded" />
        
        <select name="category" value={formData.category} onChange={handleChange} className="p-2 border rounded">
          <option value="">Select Category</option>
          <option value="Yoga">Yoga</option>
          <option value="Strength Training">Strength Training</option>
          <option value="Cardio">Cardio</option>
          <option value="Meditation">Meditation</option>
          <option value="Zumba">Zumba</option>
          <option value="Nutrition">Nutrition</option>
        </select>

        <input type="number" name="duration" placeholder="Duration (minutes)" value={formData.duration} onChange={handleChange} className="p-2 border rounded" />
        <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} className="p-2 border rounded" />
        <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleChange} className="p-2 border rounded" />

        <input type="date" name="date" value={formData.timeSlot.date} onChange={handleTimeSlotChange} className="p-2 border rounded" />
        <input type="time" name="time" value={formData.timeSlot.time} onChange={handleTimeSlotChange} className="p-2 border rounded" />

        <select name="recurrence" value={formData.timeSlot.recurrence} onChange={handleRecurrenceChange} className="p-2 border rounded">
          <option value="one-time">One-time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Weekly Selection */}
      {formData.timeSlot.recurrence === "weekly" && (
        <div className="mt-4">
          <label className="block font-medium">Select Days</label>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
            <label key={day} className="mr-2">
              <input type="checkbox" value={day} checked={formData.timeSlot.recurrenceDetails.weekly.includes(day)} onChange={() => handleWeeklySelection(day)} />
              {day}
            </label>
          ))}
        </div>
      )}

      <button onClick={handleCreateClass} className="mt-4 p-2 bg-blue-500 text-white rounded">Create Event</button>

      {/* Display Created Classes */}
      <h3 className="text-lg font-semibold mt-6">Created Events</h3>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {classes.map((event) => (
          <div key={event._id} className="p-4 border rounded shadow">
            <h4 className="font-medium">{event.title}</h4>
            <p className="text-sm text-gray-500">{event.description}</p>
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Duration:</strong> {event.duration} min</p>
            <p><strong>Capacity:</strong> {event.capacity}</p>
            <p><strong>Price:</strong> ${event.price}</p>
            <p><strong>Date:</strong> {event.timeSlots?.[0]?.date || "N/A"}</p>
            <p><strong>Time:</strong> {event.timeSlots?.[0]?.time || "N/A"}</p>
            <p><strong>Recurrence:</strong> {event.timeSlots?.[0]?.recurrence}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
