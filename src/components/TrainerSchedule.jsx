import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainerSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await axios.get("https://fitnesshub-5yf3.onrender.com/api/classes",
            { withCredentials: true });
        setSchedule(data);
        console.log("schedule======>data", data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  if (loading) return <div className="text-center">Loading schedule...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Class Schedule</h1>
      {schedule.length === 0 ? (
        <p>No events scheduled.</p>
      ) : (
        schedule.map(({ date, events }) => (
          <div key={date} className="mb-6">
            <h2 className="text-xl font-bold text-blue-600">{new Date(date).toDateString()}</h2>
            <div className="mt-2 space-y-4">
              {events.map((cls) => (
                <div key={cls._id} className="border p-4 rounded-lg shadow-md bg-white">
                  <h3 className="text-lg font-semibold">{cls.title}</h3>
                  <p className="text-gray-600">{cls.category} | {cls.capacity} slots</p>
                  <p className="text-gray-700">Duration: {cls.duration} mins | Price: ${cls.price}</p>
                  <p className="text-gray-500">
                    Time: {cls.schedule.scheduleType === "One-time" ? 
                      `${cls.schedule.oneTimeStartTime} - ${cls.schedule.oneTimeEndTime}` : "Multiple Sessions"}
                  </p>
                  <p className="text-sm text-gray-400">Trainer: {cls.trainer?.name}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TrainerSchedule;
