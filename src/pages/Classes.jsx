import { useState, useEffect } from "react";
import axios from "axios";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const categories = ["Yoga", "Strength Training", "Zumba", "Meditation", "Cardio", "Nutrition"];

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    price: "",
    capacity: "",
    schedule: {
      enabledDays: [],
      timeSlots: {},
      blockedDates: [],
      startDate: "",
      endDate: "",
    },
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await axios.get("https://fitnesshub-5yf3.onrender.com/api/classes", { withCredentials: true });
      setClasses(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prev) => ({ ...prev, [name]: value }));
  };

  const toggleDaySelection = (day) => {
    setNewClass((prev) => {
      const isSelected = prev.schedule.enabledDays.includes(day);
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          enabledDays: isSelected
            ? prev.schedule.enabledDays.filter((d) => d !== day)
            : [...prev.schedule.enabledDays, day],
          timeSlots: isSelected ? { ...prev.schedule.timeSlots, [day]: [] } : prev.schedule.timeSlots,
        },
      };
    });
  };

  const addTimeSlot = (day) => {
    setNewClass((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        timeSlots: {
          ...prev.schedule.timeSlots,
          [day]: [...(prev.schedule.timeSlots[day] || []), { startTime: "", endTime: "" }],
        },
      },
    }));
  };

  const updateTimeSlot = (day, index, field, value) => {
    setNewClass((prev) => {
      const updatedSlots = [...prev.schedule.timeSlots[day]];
      updatedSlots[index][field] = value;
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          timeSlots: { ...prev.schedule.timeSlots, [day]: updatedSlots },
        },
      };
    });
  };

  const removeTimeSlot = (day, index) => {
    setNewClass((prev) => {
      const updatedSlots = prev.schedule.timeSlots[day].filter((_, i) => i !== index);
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          timeSlots: { ...prev.schedule.timeSlots, [day]: updatedSlots },
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://fitnesshub-5yf3.onrender.com/api/classes", newClass, { withCredentials: true });
      fetchClasses();
      setNewClass({
        title: "",
        description: "",
        category: "",
        duration: "",
        price: "",
        capacity: "",
        schedule: { enabledDays: [], timeSlots: {}, blockedDates: [], startDate: "", endDate: "" },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Classes</h2>
      <form onSubmit={handleSubmit} className="mb-4 border p-4 rounded bg-gray-100 space-y-3">
        <input type="text" name="title" placeholder="Class Title" value={newClass.title} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <textarea name="description" placeholder="Class Description" value={newClass.description} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <select name="category" value={newClass.category} onChange={handleInputChange} className="border p-2 rounded w-full" required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input type="number" name="duration" placeholder="Duration (minutes)" value={newClass.duration} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <input type="number" name="price" placeholder="Price ($)" value={newClass.price} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <input type="number" name="capacity" placeholder="Capacity" value={newClass.capacity} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <div>
          <p className="font-semibold">Select Available Days:</p>
          {daysOfWeek.map((day) => (
            <button key={day} type="button" onClick={() => toggleDaySelection(day)} className={`p-2 m-1 rounded ${newClass.schedule.enabledDays.includes(day) ? "bg-green-500 text-white" : "bg-gray-300"}`}>{day}</button>
          ))}
        </div>
        {newClass.schedule.enabledDays.map((day) => (
          <div key={day} className="mt-2 p-2 border rounded">
            <p className="font-semibold">{day}</p>
            {newClass.schedule.timeSlots[day]?.map((slot, index) => (
              <div key={index} className="flex space-x-2">
                <input type="time" value={slot.startTime} onChange={(e) => updateTimeSlot(day, index, "startTime", e.target.value)} className="border p-2 rounded" required />
                <input type="time" value={slot.endTime} onChange={(e) => updateTimeSlot(day, index, "endTime", e.target.value)} className="border p-2 rounded" required />
                <button type="button" onClick={() => removeTimeSlot(day, index)} className="bg-red-500 text-white p-2 rounded">Remove</button>
              </div>
            ))}
            <button type="button" onClick={() => addTimeSlot(day)} className="bg-blue-500 text-white p-2 rounded mt-2">Add Time Slot</button>
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Create Class</button>
      </form>
    </div>
  );
};

export default Classes;