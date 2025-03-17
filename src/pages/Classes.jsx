import { useState, useEffect } from "react";
import axios from "axios";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [newClass, setNewClass] = useState({
    title: "",
    description: "",
    category: "",
    duration: 60,
    image: "",
    capacity: 10,
    price: 0,
    schedule: {
      enabledDays: [],
      timeSlots: [],
      blockedDates: [],
    },
  });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await axios.get("https://fitnesshub-5yf3.onrender.com/api/classes",{ withCredentials: true });
      setClasses(data);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch classes");
    }
  };

  const handleScheduleChange = (day, startTime, endTime) => {
    setNewClass((prev) => {
      const updatedTimeSlots = [...prev.schedule.timeSlots];
      const existingDay = updatedTimeSlots.find(slot => slot.day === day);
      if (existingDay) {
        existingDay.slots.push({ startTime, endTime });
      } else {
        updatedTimeSlots.push({ day, slots: [{ startTime, endTime }] });
      }
      return {
        ...prev,
        schedule: { ...prev.schedule, timeSlots: updatedTimeSlots },
      };
    });
  };

  const handleBlockedDateChange = (date) => {
    setNewClass((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        blockedDates: [...new Set([...prev.schedule.blockedDates, date])],
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("/api/classes", newClass);
      fetchClasses();
      setNewClass({
        title: "",
        description: "",
        category: "",
        duration: 60,
        image: "",
        capacity: 10,
        price: 0,
        schedule: {
          enabledDays: [],
          timeSlots: [],
          blockedDates: [],
        },
      });
    } catch (error) {
      console.error(error);
      setError("Failed to create class");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Manage Classes</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="mb-4 space-y-2">
        <input
          type="text"
          placeholder="Class Title"
          value={newClass.title}
          onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Category"
          value={newClass.category}
          onChange={(e) => setNewClass({ ...newClass, category: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Create Class</button>
      </form>
      <div>
        {classes.map((cls) => (
          <div key={cls._id} className="border p-4 mb-2 rounded">
            <h3 className="font-bold">{cls.title}</h3>
            <p>Category: {cls.category}</p>
            <p>Schedule:</p>
            <ul>
              {cls.schedule.timeSlots.map((slot, index) => (
                <li key={index}>{slot.day}: {slot.slots.map(s => `${s.startTime} - ${s.endTime}`).join(", ")}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
