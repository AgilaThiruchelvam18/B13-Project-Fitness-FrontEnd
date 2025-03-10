import { useState, useEffect } from "react";
import axios from "axios";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [trainerId, setTrainerId] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    trainer: "",
    description: "",
    category: "",
    duration: "",
    capacity: "",
    price: "",
    timeSlot: {
      date: "",
      time: "",
      ampm: "AM",
      recurrence: "one-time",
      recurrenceDetails: {
        daily: { startDate: "", endDate: "" },
        weekly: [],
      },
    },
  });

  useEffect(() => {
    fetchClasses();
    fetchTrainer();
  }, []);

  const fetchTrainer = async () => {
    try {
      const res = await axios.get("https://fitnesshub-5yf3.onrender.com/api/trainers/me", {
        withCredentials: true,
      });
      if (res.data && res.data._id) {
        setTrainerId(res.data._id);
      }
    } catch (err) {
      console.error("Error fetching trainer info", err);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get("https://fitnesshub-5yf3.onrender.com/api/classes", {
        withCredentials: true,
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

  const handleCreateClass = async () => {
    if (!trainerId) {
      alert("Trainer ID is missing. Please wait or refresh the page.");
      return;
    }

    try {
      const { date, time, ampm, recurrence, recurrenceDetails } = formData.timeSlot;
      const timeSlot = [{ date, time: `${time} ${ampm}`, recurrence, recurrenceDetails }];

      const res = await axios.post(
        "https://fitnesshub-5yf3.onrender.com/api/classes",
        { ...formData, trainer: trainerId, timeSlots: timeSlot },
        { withCredentials: true }
      );

      setClasses([...classes, res.data]);
      setFormData({
        title: "",
        trainer: trainerId,
        description: "",
        category: "",
        duration: "",
        capacity: "",
        price: "",
        timeSlot: {
          date: "",
          time: "",
          ampm: "AM",
          recurrence: "one-time",
          recurrenceDetails: {
            daily: { startDate: "", endDate: "" },
            weekly: [],
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
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="p-2 border rounded" />
        <input type="number" name="duration" placeholder="Duration (minutes)" value={formData.duration} onChange={handleChange} className="p-2 border rounded" />
        <input type="number" name="capacity" placeholder="Capacity" value={formData.capacity} onChange={handleChange} className="p-2 border rounded" />
        <input type="number" name="price" placeholder="Price ($)" value={formData.price} onChange={handleChange} className="p-2 border rounded" />
        <input type="date" name="date" value={formData.timeSlot.date} onChange={handleTimeSlotChange} className="p-2 border rounded" />
        <input type="time" name="time" value={formData.timeSlot.time} onChange={handleTimeSlotChange} className="p-2 border rounded" />
      </div>
      <button onClick={handleCreateClass} className="mt-4 p-2 bg-blue-500 text-white rounded">Create Class</button>
      <h3 className="text-lg font-semibold mt-6">Created Classes</h3>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {classes.map((event) => (
          <div key={event._id} className="p-4 border rounded shadow">
            <h4 className="font-medium">{event.title}</h4>
            <p className="text-sm text-gray-500">{event.description}</p>
            <p><strong>Category:</strong> {event.category}</p>
            <p><strong>Duration:</strong> {event.duration} min</p>
            <p><strong>Capacity:</strong> {event.capacity}</p>
            <p><strong>Price:</strong> ${event.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Classes;
