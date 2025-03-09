import React, { useEffect, useState } from "react";
import axios from "axios";

const Schedule = () => {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await axios.get("/trainer/schedule");
      setSchedule(res.data.schedule);
    } catch (error) {
      console.error("Error fetching schedule", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Trainer Schedule</h2>
      <ul>
        {schedule.map((s, index) => (
          <li key={index}>{s.day}: {s.timeSlots.join(", ")}</li>
        ))}
      </ul>
    </div>
  );
};

export default Schedule;
