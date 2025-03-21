
  import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainerSchedule = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [rescheduleEvent, setRescheduleEvent] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newDay, setNewDay] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");
  const [recurringTimeSlots, setRecurringTimeSlots] = useState([]);
  const [newTimeSlot, setNewTimeSlot] = useState(null);


  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const { data } = await axios.get("https://fitnesshub-5yf3.onrender.com/api/classes", {
          withCredentials: true,
        });
        setSchedule(data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);
  

  const handleView = (event) => {
    console.log("🛠 Event:", event);

    setSelectedEvent(event);
  };
  const handleReschedule = (event) => {

    setRescheduleEvent(event);
  }

  const handleEdit = (event, selectedSlot) => { 
    setEditModal(true);
    setRescheduleEvent(event);

    console.log("🛠 Selected Slot:", selectedSlot);
    console.log("🛠 Event:", event);

    if (event.schedule.scheduleType === "Recurrent" && selectedSlot) {
        setRecurringTimeSlots([{
            date: selectedSlot.date ? new Date(selectedSlot.date).toISOString() : new Date().toISOString(),
            day: selectedSlot.day || "",
            startTime: selectedSlot.startTime || "",
            endTime: selectedSlot.endTime || "",
            _id: selectedSlot._id, // Preserve slot ID for updates
        }]);

        setNewStartTime(selectedSlot.startTime || "");
        setNewEndTime(selectedSlot.endTime || "");
    } else if (event.schedule.scheduleType === "One-time") {
        const dayName = selectedSlot?.date 
            ? new Date(selectedSlot.date).toLocaleDateString("en-US", { weekday: "long" }) 
            : "";
            
        setNewDate(event.schedule.oneTimeDate || "");
        setNewDay(dayName);
        setNewStartTime(event.schedule.oneTimeStartTime || "");
        setNewEndTime(event.schedule.oneTimeEndTime || "");
    }
};



const handleSaveReschedule = async () => {
  console.log("🔹 newStartTime:", newStartTime);
  console.log("🔹 newEndTime:", newEndTime);
  console.log("🔹 recurringTimeSlots Before Update:", recurringTimeSlots);

  try {
      let payload = {};

      if (rescheduleEvent.schedule.scheduleType === "One-time") {
          if (!newDate || !newStartTime || !newEndTime) {
              alert("Please select a valid date and time slot.");
              return;
          }

          payload = {
              scheduleType: "One-time",
              newDate: new Date(newDate).toISOString(),
              newTimeSlot: {
                  startTime: newStartTime,
                  endTime: newEndTime,
              }
          };
      } else {
          // Ensure at least one valid recurring time slot
          if (!Array.isArray(recurringTimeSlots) || recurringTimeSlots.length === 0) {
              alert("Please add at least one valid recurring time slot.");
              return;
          }

          // Update only the selected slot's start and end times
          const updatedSlots = recurringTimeSlots.map(slot => ({
              ...slot, // Preserve existing slot details
              startTime: newStartTime || slot.startTime, 
              endTime: newEndTime || slot.endTime,
          }));

          console.log("🚀 Sending Updated Time Slots:", updatedSlots);

          payload = {
              scheduleType: "Recurrent",
              recurringTimeSlots: updatedSlots, // Ensure correct data is sent
              updatedSlot: updatedSlots[0], // Specify which slot is being updated
          };
      }

      console.log("🚀 Sending reschedule request:", JSON.stringify(payload, null, 2));

      const response = await axios.put(
          `https://fitnesshub-5yf3.onrender.com/api/classes/${rescheduleEvent._id}/reschedule`,
          payload,
          { withCredentials: true }
      );

      console.log("✅ Reschedule Response:", response.data);
      alert("Class rescheduled successfully!");
      setEditModal(false);
  } catch (error) {
      console.error("❌ Error rescheduling event:", error.response?.data || error.message);
      alert("Failed to reschedule class. Please try again.");
  }
};


  const handleCancel = async (eventId) => {
    if (window.confirm("Are you sure you want to cancel this event?")) {
      try {
        await axios.delete(`https://fitnesshub-5yf3.onrender.com/api/classes/${eventId}/cancel`, { withCredentials: true });
        alert("Event canceled and notification sent!");
        setSchedule((prevSchedule) => prevSchedule.map(({ date, events }) => ({
          date,
          events: events.filter((e) => e._id !== eventId)
        })).filter(({ events }) => events.length > 0));
      } catch (error) {
        console.error("Error canceling event:", error);
      }
    }
  };

  if (loading) return <div className="text-center">Loading schedule...</div>;
  console.log("selectedEvent", selectedEvent);
  console.log("rescheduleEvent", rescheduleEvent);
  console.log("recurringTimeSlots", recurringTimeSlots);
 

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
                  <p className="text-gray-500">Time: {cls.schedule.scheduleType === "One-time" ? 
                    `${cls.schedule.oneTimeStartTime} - ${cls.schedule.oneTimeEndTime}` : "Multiple Sessions"}
                  </p>
                  {cls.schedule.scheduleType !== "One-time" && cls.schedule.recurringTimes && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {cls.schedule.recurringTimes.map((time, index) => (
                        <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">{time}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex space-x-2 mt-4">
                    <button onClick={() => handleView(cls)} className="px-4 py-2 bg-blue-500 text-white rounded">View</button>
                    <button onClick={() => handleReschedule(cls)} className="px-4 py-2 bg-green-500 text-white rounded">Reschedule</button>
                    <button onClick={() => handleCancel(cls._id)} className="px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

{selectedEvent && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-2/3 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
      <p>Category: {selectedEvent.category}</p>
      <p>Capacity: {selectedEvent.capacity}</p>
      <p>Duration: {selectedEvent.duration} mins</p>
      <p>Price: ${selectedEvent.price}</p>

      {selectedEvent.schedule.scheduleType !== "One-time" &&
        selectedEvent.schedule.timeSlots &&
        selectedEvent.schedule.startDate &&
        selectedEvent.schedule.endDate ? (
          <div className="w-full grid grid-cols-4 gap-2 mt-2">
            {(() => {
  const startDate = new Date(selectedEvent.schedule.startDate);
  const endDate = new Date(selectedEvent.schedule.endDate);
  const enabledDays = selectedEvent.schedule.enabledDays || []; // Ensure this is an array
  const sessions = [];

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
    const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" });

    // Check if the current day matches an enabled day
    if (enabledDays.includes(dayName)) {
      // Filter time slots that match the current day
      const daySlots = selectedEvent.schedule.timeSlots.filter(
        (slot) => slot.day === dayName // Ensure the stored "day" field is used correctly
      );

      daySlots.forEach((slot, index) => {
        sessions.push(
          <div key={`${dateString}-${index}`} className="w-5/6 flex flex-row justify-between">
            <span className="bg-gray-200 px-2 py-1 rounded text-sm">
              {dayName}, {dateString}: {slot.startTime} - {slot.endTime}
            </span>
          </div>
        );
      });
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return sessions.length > 0 ? sessions : <p>No scheduled sessions.</p>;
})()}

          </div>
        ) : (
          // One-time Event Handling
          (() => {
            if (!selectedEvent.schedule.oneTimeDate) {
              return <p className="text-gray-700">No date selected.</p>;
            }

            const eventDate = new Date(selectedEvent.schedule.oneTimeDate).toLocaleDateString("en-CA");

            return (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-semibold">One-Time Event</h3>
                <p className="text-gray-700">Date: {eventDate}</p>
                <p className="text-gray-700">
                  Time: {selectedEvent.schedule.oneTimeStartTime} - {selectedEvent.schedule.oneTimeEndTime}
                </p>
              </div>
            );
          })()
        )}

      <button onClick={() => setSelectedEvent(null)} className="mt-4 px-4 py-2 bg-gray-500 text-white rounded">
        Close
      </button>
    </div>
  </div>
)}

{rescheduleEvent && (
  <div className="fixed top-0 left-0 w-full h-screen flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
    <div className="bg-white p-6 mx-auto rounded-lg w-2/3 h-screen overflow-y-auto m-4">
      <div>
        <h2 className="text-xl font-bold">{rescheduleEvent.title}</h2>
        <p>Category: {rescheduleEvent.category}</p>
        <p>Capacity: {rescheduleEvent.capacity}</p>
        <p>Duration: {rescheduleEvent.duration} mins</p>
        <p>Price: ${rescheduleEvent.price}</p>

        {/* Multi-session Event Handling */}
        {rescheduleEvent.schedule.scheduleType !== "One-time" &&
        rescheduleEvent.schedule.timeSlots &&
        rescheduleEvent.schedule.startDate &&
        rescheduleEvent.schedule.endDate ? (
          <div className="w-full grid grid-cols-4 gap-2 mt-2">
            {(() => {
  const startDate = new Date(rescheduleEvent.schedule.startDate);
  const endDate = new Date(rescheduleEvent.schedule.endDate);
  const enabledDays = rescheduleEvent.schedule.enabledDays || []; // List of allowed days
  const sessions = [];

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const dateString = currentDate.toISOString().split("T")[0]; // Format YYYY-MM-DD
    const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" });

    // Check if current day is an enabled day
    if (enabledDays.includes(dayName)) {
      // Filter time slots based on the day name instead of the date
      const daySlots = rescheduleEvent.schedule.timeSlots.filter(
        (slot) => slot.day === dayName // Match by day instead of date
      );

      daySlots.forEach((slot, index) => {
        sessions.push(
          <div key={`${dateString}-${index}`} className="w-5/6 flex flex-row justify-between">
            <span className="bg-gray-200 px-2 py-1 rounded text-sm">
              {dayName}, {dateString}: {slot.startTime} - {slot.endTime}
            </span>
            <button
              onClick={() => handleEdit(rescheduleEvent, slot)}
              className="m-2 px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
              aria-label="Edit session"
            >
              Edit
            </button>
          </div>
        );
      });
    }

    // Move to the next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return sessions.length > 0 ? sessions : <p>No scheduled sessions.</p>;
})()}

          </div>
        ) : (
          // One-time Event Handling
          (() => {
            if (!rescheduleEvent.schedule.oneTimeDate) {
              return <p className="text-gray-700">No date selected.</p>;
            }

            const eventDate = new Date(rescheduleEvent.schedule.oneTimeDate).toLocaleDateString("en-CA");

            return (
              <div className="mt-4 p-4 bg-gray-100 rounded">
                <h3 className="text-lg font-semibold">One-Time Event</h3>
                <p className="text-gray-700">Date: {eventDate}</p>
                <p className="text-gray-700">
                  Time: {rescheduleEvent.schedule.oneTimeStartTime} - {rescheduleEvent.schedule.oneTimeEndTime}
                </p>
                <button
                  onClick={() => handleEdit(rescheduleEvent, {
                    startTime: rescheduleEvent.schedule.oneTimeStartTime,
                    endTime: rescheduleEvent.schedule.oneTimeEndTime,
                    date: eventDate
                  })}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                  aria-label="Edit session"
                >
                  Edit One-Time Event
                </button>
              </div>
            );
          })()
        )}
      </div>

      <button
        onClick={() => setRescheduleEvent(null)}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded cursor-pointer"
        aria-label="Close modal"
      >
        Close
      </button>
    </div>
  </div>
)}





    
{editModal && rescheduleEvent && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-1/3">
      <h2 className="text-xl font-bold">Reschedule Event</h2>

      {rescheduleEvent.schedule.scheduleType === "Recurrent" ? (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Edit Recurring Session</h3>
          <label className="block text-gray-700">Start Time</label>
          <input
            type="time"
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block text-gray-700 mt-2">End Time</label>
          <input
            type="time"
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={handleSaveReschedule}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Edit One-Time Session</h3>
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block text-gray-700 mt-2">Start Time</label>
          <input
            type="time"
            value={newStartTime}
            onChange={(e) => setNewStartTime(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <label className="block text-gray-700 mt-2">End Time</label>
          <input
            type="time"
            value={newEndTime}
            onChange={(e) => setNewEndTime(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <button
            onClick={handleSaveReschedule}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Save Changes
          </button>
        </div>
      )}

      <button
        onClick={() => setEditModal(false)}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Cancel
      </button>
    </div>
  </div>
)}




    </div>
  );
};

export default TrainerSchedule;





