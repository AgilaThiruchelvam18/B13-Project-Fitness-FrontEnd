import { useState, useEffect } from "react";
import axios from "axios";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const categories = ["Yoga", "Strength Training", "Zumba", "Meditation", "Cardio", "Nutrition"];

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [scheduleType, setScheduleType] = useState("One-time");
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
      oneTimeDate: "",
      oneTimeStartTime: "",
      oneTimeEndTime: ""
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

  const handleScheduleTypeChange = (e) => {
    setScheduleType(e.target.value);
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
        schedule: {
          enabledDays: [],
          timeSlots: {},
          blockedDates: [],
          startDate: "",
          endDate: "",
          oneTimeDate: "",
          oneTimeStartTime: "",
          oneTimeEndTime: ""
        },
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
        
        <select value={scheduleType} onChange={handleScheduleTypeChange} className="border p-2 rounded w-full" required>
          <option value="One-time">One-time</option>
          <option value="Recurrent">Recurrent</option>
        </select>

        {scheduleType === "One-time" ? (
          <>
            <input 
              type="date" 
              name="oneTimeDate" 
              value={newClass.schedule.oneTimeDate} 
              onChange={(e) => setNewClass((prev) => ({ 
                ...prev, 
                schedule: { ...prev.schedule, oneTimeDate: e.target.value } 
              }))} 
              className="border p-2 rounded w-full" 
              required 
            />
            <input 
              type="time" 
              name="oneTimeStartTime" 
              value={newClass.schedule.oneTimeStartTime} 
              onChange={(e) => setNewClass((prev) => ({ 
                ...prev, 
                schedule: { ...prev.schedule, oneTimeStartTime: e.target.value } 
              }))} 
              className="border p-2 rounded w-full" 
              required 
            />
            <input 
              type="time" 
              name="oneTimeEndTime" 
              value={newClass.schedule.oneTimeEndTime} 
              onChange={(e) => setNewClass((prev) => ({ 
                ...prev, 
                schedule: { ...prev.schedule, oneTimeEndTime: e.target.value } 
              }))} 
              className="border p-2 rounded w-full" 
              required 
            />
          </>
        ) : (
          <>
            <input type="date" name="startDate" value={newClass.schedule.startDate} onChange={(e) => setNewClass((prev) => ({ ...prev, schedule: { ...prev.schedule, startDate: e.target.value } }))} className="border p-2 rounded w-full" required />
            <input type="date" name="endDate" value={newClass.schedule.endDate} onChange={(e) => setNewClass((prev) => ({ ...prev, schedule: { ...prev.schedule, endDate: e.target.value } }))} className="border p-2 rounded w-full mt-2" required />
          </>
        )}
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Create Class</button>
      </form>
    </div>
  );
};

export default Classes;
