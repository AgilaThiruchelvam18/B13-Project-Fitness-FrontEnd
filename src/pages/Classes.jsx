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
      scheduleType: "One-time",
      oneTimeDate: "",
      oneTimeStartTime: "",
      oneTimeEndTime: "",
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
  
    setNewClass((prev) => {
      // Check if the field belongs to the schedule object
      if (["oneTimeDate", "oneTimeStartTime", "oneTimeEndTime", "startDate", "endDate"].includes(name)) {
        return {
          ...prev,
          schedule: { ...prev.schedule, [name]: value },
        };
      }
      return { ...prev, [name]: value };
    });
  };
  
  const handleScheduleTypeChange = (e) => {
    setNewClass((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, scheduleType: e.target.value },
    }));
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
    setNewClass((prev) => {
      const updatedSlots = prev.schedule.timeSlots[day] || [];
      return {
        ...prev,
        schedule: {
          ...prev.schedule,
          timeSlots: {
            ...prev.schedule.timeSlots,
            [day]: [...updatedSlots, { startTime: "", endTime: "" }],
          },
        },
      };
    });
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

    // Ensure schedule exists
    if (!newClass.schedule) {
        console.error("Error: Schedule is undefined.");
        return;
    }

    if (newClass.schedule.scheduleType === "Recurrent") {
        console.log("Time Slots Before Sending:", newClass.schedule.timeSlots);

        if (!newClass.schedule.startDate || !newClass.schedule.endDate) {
            alert("Please select a valid start and end date.");
            return;
        }

        let formattedTimeSlots = [];

        for (let day of newClass.schedule.enabledDays || []) {
            let slots = newClass.schedule.timeSlots?.[day] || [];

            if (Array.isArray(slots) && slots.length > 0) {
                slots.forEach(slot => {
                    formattedTimeSlots.push({
                        date: newClass.schedule.startDate, // Placeholder, update logic if needed
                        day,
                        startTime: slot.startTime,
                        endTime: slot.endTime
                    });
                });
            }
        }

        if (formattedTimeSlots.length === 0) {
            alert("Please add at least one valid time slot for a recurrent schedule.");
            return;
        }

        // Assign transformed timeSlots
        newClass.schedule.timeSlots = formattedTimeSlots;
    }

    try {
        console.log("Submitting Class Data:", newClass);

        const response = await axios.post(
            "https://fitnesshub-5yf3.onrender.com/api/classes",
            newClass,
            { withCredentials: true }
        );

        console.log("Response:", response.data);
        fetchClasses();
        setNewClass({ 
            title: "", description: "", category: "", duration: "", price: "", capacity: "",
            schedule: { scheduleType: "One-time", oneTimeDate: "", oneTimeStartTime: "", oneTimeEndTime: "", enabledDays: [], timeSlots: {}, blockedDates: [], startDate: "", endDate: "" }
        });
    } catch (error) {
        console.error("Error Submitting Class:", error.response?.data || error.message);
    }
};


  

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Classes</h2>
      <form onSubmit={handleSubmit} className="mb-4 border p-4 rounded bg-gray-100 space-y-3">
        <input type="text" name="title" placeholder="Class Title" value={newClass.title} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <textarea name="description" placeholder="Class Description" value={newClass.description} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <select name="category" value={newClass.category} onChange={handleInputChange} className="border p-2 rounded w-full">
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input type="number" name="duration" placeholder="Duration (minutes)" value={newClass.duration} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <input type="number" name="price" placeholder="Price ($)" value={newClass.price} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <input type="number" name="capacity" placeholder="Capacity" value={newClass.capacity} onChange={handleInputChange} className="border p-2 rounded w-full" required />
        <select name="scheduleType" value={newClass.schedule.scheduleType} onChange={handleScheduleTypeChange} className="border p-2 rounded w-full">
          <option value="One-time">One-time</option>
          <option value="Recurrent">Recurrent</option>
        </select>
        {newClass.schedule.scheduleType === "One-time" ? (
          <>
            <input type="date" name="oneTimeDate" value={newClass.schedule.oneTimeDate} onChange={handleInputChange} className="border p-2 rounded w-full" required />
            <input type="time" name="oneTimeStartTime" value={newClass.schedule.oneTimeStartTime} onChange={handleInputChange} className="border p-2 rounded w-full" required />
            <input type="time" name="oneTimeEndTime" value={newClass.schedule.oneTimeEndTime} onChange={handleInputChange} className="border p-2 rounded w-full" required />
          </>
        ) : (
          <>
            <div>
            <input 
      type="date" 
      name="startDate" 
      value={newClass.schedule.startDate} 
      onChange={handleInputChange} 
      className="border p-2 rounded w-full m-1" 
      required 
    />
    <input 
      type="date" 
      name="endDate" 
      value={newClass.schedule.endDate} 
      onChange={handleInputChange} 
      className="border p-2 rounded w-full m-1" 
      required 
    />
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
          </>
        )}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-4">Create Class</button>
      </form>
    </div>
  );
};

export default Classes;