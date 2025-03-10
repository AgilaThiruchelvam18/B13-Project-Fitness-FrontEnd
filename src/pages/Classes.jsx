import { useState } from "react";

const Classes = () => {
  const [timeSlots, setTimeSlots] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    trainer: "", // Should be set dynamically from logged-in trainer
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
      const { weekly } = prev.timeSlot.recurrenceDetails;
      return {
        ...prev,
        timeSlot: {
          ...prev.timeSlot,
          recurrenceDetails: {
            ...prev.timeSlot.recurrenceDetails,
            weekly: weekly.includes(day)
              ? weekly.filter((d) => d !== day)
              : [...weekly, day],
          },
        },
      };
    });
  };

  const handleAddTimeSlot = () => {
    setTimeSlots([...timeSlots, formData.timeSlot]);
    setFormData((prev) => ({
      ...prev,
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
    }));
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Create Class</h2>
      <div className="grid grid-cols-2 gap-4">
        {/* Title */}
        <input type="text" name="title" placeholder="Class Title" value={formData.title} onChange={handleChange} className="p-2 border rounded" />

        {/* Description */}
        <input type="text" name="description" placeholder="Class Description" value={formData.description} onChange={handleChange} className="p-2 border rounded" />

        {/* Category */}
        <select name="category" value={formData.category} onChange={handleChange} className="p-2 border rounded">
          <option value="">Select Category</option>
          <option value="Yoga">Yoga</option>
          <option value="Strength Training">Strength Training</option>
          <option value="Cardio">Cardio</option>
          <option value="Meditation">Meditation</option>
          <option value="Zumba">Zumba</option>
          <option value="Nutrition">Nutrition</option>
        </select>

        {/* Duration */}
        <input type="number" name="duration" placeholder="Duration (minutes)" value={formData.duration} onChange={handleChange} className="p-2 border rounded" />

        {/* Capacity */}
        <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} className="p-2 border rounded" />

        {/* Price */}
        <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleChange} className="p-2 border rounded" />

        {/* Date Picker */}
        <input type="date" name="date" value={formData.timeSlot.date} onChange={handleTimeSlotChange} className="p-2 border rounded" />
        
        {/* Time Picker */}
        <input type="time" name="time" value={formData.timeSlot.time} onChange={handleTimeSlotChange} className="p-2 border rounded" />
        
        {/* Recurrence Selection */}
        <select name="recurrence" value={formData.timeSlot.recurrence} onChange={handleRecurrenceChange} className="p-2 border rounded">
          <option value="one-time">One-time</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Recurrence Details */}
      {formData.timeSlot.recurrence === "daily" && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input type="date" name="startDate" value={formData.timeSlot.recurrenceDetails.daily.startDate} onChange={(e) => setFormData((prev) => ({ ...prev, timeSlot: { ...prev.timeSlot, recurrenceDetails: { ...prev.timeSlot.recurrenceDetails, daily: { ...prev.timeSlot.recurrenceDetails.daily, startDate: e.target.value } } } }))} className="p-2 border rounded" />
          <input type="date" name="endDate" value={formData.timeSlot.recurrenceDetails.daily.endDate} onChange={(e) => setFormData((prev) => ({ ...prev, timeSlot: { ...prev.timeSlot, recurrenceDetails: { ...prev.timeSlot.recurrenceDetails, daily: { ...prev.timeSlot.recurrenceDetails.daily, endDate: e.target.value } } } }))} className="p-2 border rounded" />
        </div>
      )}

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

      {formData.timeSlot.recurrence === "monthly" && (
        <div className="mt-4">
          <select value={formData.timeSlot.recurrenceDetails.monthly.type} onChange={(e) => setFormData((prev) => ({ ...prev, timeSlot: { ...prev.timeSlot, recurrenceDetails: { ...prev.timeSlot.recurrenceDetails, monthly: { ...prev.timeSlot.recurrenceDetails.monthly, type: e.target.value } } } }))} className="p-2 border rounded">
            <option value="daily">Daily</option>
            <option value="alternate">Alternate Days</option>
            <option value="specific">Specific Day</option>
          </select>
          {formData.timeSlot.recurrenceDetails.monthly.type === "specific" && (
            <input type="number" min="1" max="31" value={formData.timeSlot.recurrenceDetails.monthly.specificDay} onChange={(e) => setFormData((prev) => ({ ...prev, timeSlot: { ...prev.timeSlot, recurrenceDetails: { ...prev.timeSlot.recurrenceDetails, monthly: { ...prev.timeSlot.recurrenceDetails.monthly, specificDay: e.target.value } } } }))} className="p-2 border rounded mt-2" placeholder="Enter Date (1-31)" />
          )}
        </div>
      )}

      <button onClick={handleAddTimeSlot} className="mt-4 p-2 bg-blue-500 text-white rounded">Add Time Slot</button>
    </div>
  );
};

export default Classes;
