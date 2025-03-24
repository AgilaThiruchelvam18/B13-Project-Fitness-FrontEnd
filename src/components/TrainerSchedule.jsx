
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
    setSelectedEvent(event);
  };
  const handleReschedule = (event) => {
    setRescheduleEvent(event);
  }

  const handleEdit = (event, selectedSlot) => { 
    setEditModal(true);
    setRescheduleEvent(event);

    console.log("Selected Slot:", selectedSlot);
    console.log("Event:", event);

    if (event.schedule.scheduleType === "Recurrent" && selectedSlot) {
        const selectedDate = selectedSlot.date && !isNaN(new Date(selectedSlot.date)) 
        ? new Date(selectedSlot.date) 
        : new Date(); // Ensure valid date

    const dayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" }); 
        setRecurringTimeSlots([{
            date: selectedSlot.date && !isNaN(new Date(selectedSlot.date)) 
                ? new Date(selectedSlot.date).toISOString() 
                : new Date().toISOString(), // Ensure valid date
                day: selectedSlot.day || "",
            startTime: selectedSlot.startTime || "",
            endTime: selectedSlot.endTime || "",
            _id: selectedSlot._id,
        }]);

        setNewStartTime(selectedSlot.startTime || "");
        setNewEndTime(selectedSlot.endTime || "");

    } else if (event.schedule.scheduleType === "One-time") {
        setNewDate(event.schedule.oneTimeDate || "");
        setNewDay(dayName); 
        setNewStartTime(event.schedule.oneTimeStartTime || "");
        setNewEndTime(event.schedule.oneTimeEndTime || "");
    }
};

const handleSaveReschedule = async () => {
  const updatedSchedule = {
    scheduleType: rescheduleEvent.schedule.scheduleType,
    ...(rescheduleEvent.schedule.scheduleType === "Recurrent"
      ? {
          recurringTimeSlots: [
            {
              date: new Date().toISOString(), // Dummy date (modify if needed)
              day: new Date().toLocaleString("en-US", { weekday: "long" }), // Get current day
              startTime: newStartTime,
              endTime: newEndTime,
            },
          ],
        }
      : {
          newDate,
          oneTimeStartTime: newStartTime,
          oneTimeEndTime: newEndTime,
        }),
  };

  console.log("📢 Sending updated schedule:", updatedSchedule);

  try {
    const response = await fetch(
      `https://fitnesshub-5yf3.onrender.com/api/classes/${rescheduleEvent._id}/reschedule`,
      {
        // method: "PUT",
        // headers: { "Content-Type": "application/json" },
        // body: JSON.stringify(updatedSchedule),
        withCredentials: true 
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to reschedule event.");
    }

    console.log("✅ Event rescheduled successfully:", data);
    setEditModal(false);
  } catch (error) {
    console.error("❌ Error rescheduling event:", error.message);
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
  console.log("schedule", schedule);


  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Class Schedule</h1>
      {schedule && Array.isArray(schedule) && schedule.length > 0 ? (
  schedule.map((cls, index) => (
    <div key={cls._id || index} className="mb-6 border p-4 rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold text-blue-600">{cls.title}</h2>
      <p className="text-gray-600">{cls.category} | {cls.capacity} slots</p>
      <p className="text-gray-700">Duration: {cls.duration} mins | Price: ${cls.price}</p>
{/* 
      {cls.schedule && cls.schedule.timeSlots && cls.schedule.timeSlots.length > 0 ? (
        cls.schedule.timeSlots.map((slot) => (
          <div key={slot._id} className="mt-2 p-2 bg-gray-100 rounded">
            <p className="text-gray-500">{slot.day} | {new Date(slot.date).toDateString()}</p>
            <p className="text-gray-700">Time: {slot.startTime} - {slot.endTime}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No time slots available</p>
      )} */}

      <div className="flex space-x-2 mt-4">
        <button onClick={() => handleView(cls)} className="px-4 py-2 bg-blue-500 text-white rounded">View</button>
        <button onClick={() => handleReschedule(cls)} className="px-4 py-2 bg-green-500 text-white rounded">Reschedule</button>
        <button onClick={() => handleCancel(cls._id)} className="px-4 py-2 bg-red-500 text-white rounded">Cancel</button>
      </div>
    </div>
  ))
) : (
  <p>No events scheduled.</p>
)}


{selectedEvent && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-lg w-2/3 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold">{selectedEvent.title}</h2>
      <p>Category: {selectedEvent.category}</p>
      <p>Capacity: {selectedEvent.capacity}</p>
      <p>Duration: {selectedEvent.duration} mins</p>
      <p>Price: ${selectedEvent.price}</p>

      {/* Recurrent Event Handling */}
      {selectedEvent.schedule &&
      selectedEvent.schedule.scheduleType === "Recurrent" &&
      selectedEvent.schedule.timeSlots &&
      selectedEvent.schedule.startDate &&
      selectedEvent.schedule.endDate ? (
        <div className="w-full grid grid-cols-4 gap-2 mt-2">
          {(() => {
            const startDate = new Date(selectedEvent.schedule.startDate);
            const endDate = new Date(selectedEvent.schedule.endDate);
            const enabledDays = selectedEvent.schedule.enabledDays || []; // Ensure enabledDays is an array
            const sessions = [];

            let currentDate = new Date(startDate);
            while (currentDate <= endDate) {
              const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" });

              // Check if current day is in enabledDays
              if (enabledDays.includes(dayName)) {
                // Get time slots for the current day
                const daySlots = selectedEvent.schedule.timeSlots.filter(slot => slot.day === dayName);

                daySlots.forEach((slot, index) => {
                  sessions.push(
                    <div key={`${currentDate.toISOString()}-${index}`} className="w-5/6 flex flex-row justify-between">
                      <div className="bg-gray-200 px-4 py-1 rounded text-sm">
                        <p>{currentDate.toLocaleDateString("en-CA")}</p>
                        <p>{slot.startTime} - {slot.endTime}</p>
                      </div>
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
        // One-Time Event Handling
        selectedEvent.schedule &&
        selectedEvent.schedule.scheduleType === "One-time" &&
        selectedEvent.schedule.oneTimeDate ? (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="text-lg font-semibold">One-Time Event</h3>
            <p className="text-gray-700">Date: {new Date(selectedEvent.schedule.oneTimeDate).toLocaleDateString("en-CA")}</p>
            <p className="text-gray-700">
              Time: {selectedEvent.schedule.oneTimeStartTime} - {selectedEvent.schedule.oneTimeEndTime}
            </p>
          </div>
        ) : (
          <p className="text-gray-700">No scheduled sessions.</p>
        )
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

        {/* 🔄 Recurrent Event Handling */}
        {rescheduleEvent.schedule?.scheduleType !== "One-time" &&
        rescheduleEvent.schedule?.timeSlots &&
        rescheduleEvent.schedule?.startDate &&
        rescheduleEvent.schedule?.endDate ? (
          <div className="w-full grid grid-cols-4 gap-2 mt-2">
            {(() => {
              const startDate = new Date(rescheduleEvent.schedule.startDate);
              const endDate = new Date(rescheduleEvent.schedule.endDate);
              const enabledDays = rescheduleEvent.schedule.enabledDays || []; // ✅ Ensure it's an array
              const sessions = [];

              let currentDate = new Date(startDate);
              while (currentDate <= endDate) {
                const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" });

                if (enabledDays.includes(dayName)) {
                  // ✅ Corrected timeSlots filtering using dayName
                  const daySlots = rescheduleEvent.schedule.timeSlots.filter(slot => slot.day === dayName);

                  daySlots.forEach((slot, index) => {
                    sessions.push(
                      <div key={`${currentDate.toISOString()}-${index}`} className="w-5/6 flex flex-row justify-between">
                        <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                          {currentDate.toLocaleDateString("en-CA")}: {slot.startTime} - {slot.endTime}
                        </span>
                        <button
                          onClick={() => handleEdit(rescheduleEvent, slot)} // ✅ Passes correct slot data
                          className="m-2 px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
                          aria-label="Edit session"
                        >
                          Edit
                        </button>
                      </div>
                    );
                  });
                }

                currentDate.setDate(currentDate.getDate() + 1);
              }

              return sessions.length > 0 ? sessions : <p>No scheduled sessions.</p>;
            })()}
          </div>
        ) : (
          // 🕐 One-time Event Handling
          rescheduleEvent.schedule?.oneTimeDate ? (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="text-lg font-semibold">One-Time Event</h3>
              <p className="text-gray-700">
                Date: {new Date(rescheduleEvent.schedule.oneTimeDate).toLocaleDateString("en-CA")}
              </p>
              <p className="text-gray-700">
                Time: {rescheduleEvent.schedule.oneTimeStartTime} - {rescheduleEvent.schedule.oneTimeEndTime}
              </p>
              <button
                onClick={() => handleEdit(rescheduleEvent, {
                  startTime: rescheduleEvent.schedule.oneTimeStartTime,
                  endTime: rescheduleEvent.schedule.oneTimeEndTime,
                  date: rescheduleEvent.schedule.oneTimeDate
                })}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
                aria-label="Edit session"
              >
                Edit One-Time Event
              </button>
            </div>
          ) : (
            <p className="text-gray-700">No date selected.</p>
          )
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

      {rescheduleEvent?.schedule?.scheduleType === "Recurrent" ? (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Edit Recurring Session</h3>
          
          {/* 🕒 Start Time Input */}
          <label className="block text-gray-700">Start Time</label>
          <input
            type="time"
            value={newStartTime || ""}
            onChange={(e) => setNewStartTime(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* ⏳ End Time Input */}
          <label className="block text-gray-700 mt-2">End Time</label>
          <input
            type="time"
            value={newEndTime || ""}
            onChange={(e) => setNewEndTime(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* 💾 Save Button */}
          <button
            onClick={handleSaveReschedule}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </div>
      ) : (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <h3 className="text-lg font-semibold">Edit One-Time Session</h3>
          
          {/* 📅 Date Input */}
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            value={newDate || ""}
            onChange={(e) => setNewDate(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* 🕒 Start Time Input */}
          <label className="block text-gray-700 mt-2">Start Time</label>
          <input
            type="time"
            value={newStartTime || ""}
            onChange={(e) => setNewStartTime(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* ⏳ End Time Input */}
          <label className="block text-gray-700 mt-2">End Time</label>
          <input
            type="time"
            value={newEndTime || ""}
            onChange={(e) => setNewEndTime(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* 💾 Save Button */}
          <button
            onClick={handleSaveReschedule}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* ❌ Cancel Button */}
      <button
        onClick={() => setEditModal(false)}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
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





