import { useEffect, useState } from "react";
import axios from "axios";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axios.get("https://fitnesshub-5yf3.onrender.com/api/classes/upcomingclasses", {
          withCredentials: true,
        });
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      }
    };
    fetchClasses();
  }, []);

  // Convert Date String to Day, Date, Time (AM/PM), and Month
  const formatTimeSlot = (isoDate) => {
    const date = new Date(isoDate);
    const day = date.toLocaleDateString("en-US", { weekday: "short" }); // Mon, Tue...
    const month = date.toLocaleDateString("en-US", { month: "short" }); // Jan, Feb...
    const dateNum = date.getDate();
    const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

    return { day, dateNum, time, month };
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Available Classes</h1>

      {/* Display trainers with their classes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div 
            key={cls._id} 
            className="border rounded-lg p-4 shadow-lg cursor-pointer hover:shadow-xl transition"
            onClick={() => {
              setSelectedTrainer(cls.trainer);
              setSelectedClass(cls);
            }}
          >
            <h2 className="text-xl font-semibold">{cls.title}</h2>
            <p className="text-gray-600">{cls.category} | {cls.duration} mins</p>
            <p className="text-gray-500">Capacity: {cls.capacity}</p>
            <p className="text-gray-800 font-bold">₹{cls.price}</p>
          </div>
        ))}
      </div>

      {/* Trainer Profile & Time Slots (Grid) */}
      {selectedTrainer && selectedClass && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold">{selectedClass.title}</h2>
          <p className="text-lg text-gray-700">{selectedClass.description}</p>

          {/* Time Slots Display as Grid */}
          <div className="mt-4">
            <h3 className="text-xl font-semibold">Available Time Slots</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
              {selectedClass.timeSlots?.map((slot, index) => {
                const formattedSlot = formatTimeSlot(slot);
                return (
                  <div key={index} className="bg-blue-500 text-white p-3 rounded-lg text-center shadow-md">
                    <p className="font-semibold">{formattedSlot.day}</p>
                    <p className="text-lg">{formattedSlot.dateNum} {formattedSlot.month}</p>
                    <p className="text-sm">{formattedSlot.time}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classes;
