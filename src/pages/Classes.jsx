import { useState, useEffect } from "react";
import axios from "axios";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    trainer: "", // Remove localStorage
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
    const fetchTrainer = async () => {
      try {
        const res = await axios.get("https://fitnesshub-5yf3.onrender.com/api/trainers/me", {
          withCredentials: true,
        });
        setFormData((prev) => ({ ...prev, trainer: res.data._id })); // Set trainer ID
      } catch (err) {
        console.error("Error fetching trainer info", err);
      }
    };
    fetchTrainer();
  }, []);

  const handleCreateClass = async () => {
    try {
      if (!formData.trainer) {
        alert("Trainer ID not found. Please log in again.");
        return;
      }

      // Validate required fields
      if (!formData.category || !formData.duration || !formData.capacity || !formData.price) {
        alert("Please fill all required fields.");
        return;
      }

      const { date, time, ampm, recurrence, recurrenceDetails } = formData.timeSlot;
      const timeSlot = [{ date, time: `${time} ${ampm}`, recurrence, recurrenceDetails }];

      const res = await axios.post(
        "https://fitnesshub-5yf3.onrender.com/api/classes",
        { ...formData, timeSlots: timeSlot },
        { withCredentials: true }
      );

      setClasses([...classes, res.data]);
      setFormData({
        title: "",
        trainer: formData.trainer, // Preserve trainer ID
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
    <div>
      <h2>Create Class</h2>
      <input type="text" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Title" />
      <input type="text" name="category" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="Category" />
      <input type="text" name="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="Duration" />
      <input type="text" name="capacity" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} placeholder="Capacity" />
      <input type="text" name="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" />

      <button onClick={handleCreateClass}>Create Class</button>
    </div>
  );
};

export default Classes;
