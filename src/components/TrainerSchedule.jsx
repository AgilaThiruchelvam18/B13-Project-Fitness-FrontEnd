
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
  const [updatedSlot, setUpdatedSlot] = useState({});

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
  
  const disablePastDate = () => {
    const today = new Date();
    today.setDate(today.getDate()); // Ensure we're using today's date
    return today.toISOString().split("T")[0]; // Format to YYYY-MM-DD
  };
  
  const disablePastTime = (selectedDate, selectedTime) => {
    const today = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    
    return selectedDateTime <= today;
  };
  
    
  
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

    const scheduleType = event.schedule?.scheduleType;

    if (scheduleType === "Recurrent") {
        const selectedDate = selectedSlot?.date ? new Date(selectedSlot.date) : new Date();

        setNewDate(selectedDate.toISOString().split("T")[0]); 
        setNewDay(selectedDate.toLocaleDateString("en-US", { weekday: "long" }));
        setNewStartTime(selectedSlot?.startTime || "");
        setNewEndTime(selectedSlot?.endTime || "");   
            setRecurringTimeSlots([{
                id:selectedSlot.id,
                date: selectedDate.toISOString().split("T")[0],
                day: selectedDate.toLocaleDateString("en-US", { weekday: "long" }),
                startTime: selectedSlot?.startTime || "", 
                endTime: selectedSlot?.endTime || "",
            }]);
        
    } 
    else if (scheduleType === "One-time") {
        const eventDate = event.schedule?.oneTimeDate ? new Date(event.schedule.oneTimeDate) : new Date();
        
        setNewDate(eventDate.toISOString().split("T")[0]);
        setNewDay(eventDate.toLocaleDateString("en-US", { weekday: "long" }));
        setNewStartTime(event.schedule?.oneTimeStartTime || "");
        setNewEndTime(event.schedule?.oneTimeEndTime || "");
    }
};




const handleSaveReschedule = async () => {
  try {
    let payload = {}; // Declare payload at the top

    // 🔹 Handle One-time Event Rescheduling
    if (rescheduleEvent.schedule.scheduleType === "One-time") {
      if (!newDate || !newDay || !newStartTime || !newEndTime) {
        alert("Please select a date and time slot before rescheduling.");
        return;
      }

      payload = {
        scheduleType: "One-time",
        newDate: new Date(newDate).toISOString(),
        newDay: newDay,
        newTimeSlot: {
          startTime: newStartTime,
          endTime: newEndTime,
        },
      };
    }
    // 🔹 Handle Recurrent Event Rescheduling
    else if (rescheduleEvent.schedule.scheduleType === "Recurrent") {
      console.log("Recurring Time Slots:", recurringTimeSlots);

      const formattedSlots = recurringTimeSlots
        .map((slot) => {
          if (!slot.date || !slot.day) return null;

          const validDate = new Date(slot.date);
          if (isNaN(validDate.getTime())) return null;

          return {
            id: slot.id,  // Ensure `_id` is present
            date: validDate.toISOString(),
            day: validDate.toLocaleDateString("en-US", { weekday: "long" }),
            startTime: newStartTime || slot.startTime,
            endTime: newEndTime || slot.endTime,
          };
        })
        .filter(Boolean);

      if (formattedSlots.length === 0) {
        alert("Recurrent schedule must have at least one valid time slot.");
        return;
      }

      // 🔹 Ensure updatedSlot has `_id` before using it
      const updatedSlot = formattedSlots.find(slot => slot.id);

      if (!updatedSlot) {
        alert("Error: No valid time slot found for update.");
        return;
      }

      payload = {
        scheduleType: "Recurrent",
        recurringTimeSlots: formattedSlots,
        updatedSlot, // Ensure this is well-defined
      };
    } else {
      alert("Invalid schedule type.");
      return;
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
    window.location.reload(); // Refresh to reflect changes

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
               const enabledDays = selectedEvent.schedule.enabledDays || [];
               const sessions = [];
           
               let currentDate = new Date(startDate);
               while (currentDate <= endDate) {
                 const dateString = currentDate.toLocaleDateString("en-CA");
                 const dayName = currentDate.toLocaleDateString("en-US", { weekday: "long" });
           
                 if (enabledDays.includes(dayName)) {
                   const daySlots = selectedEvent.schedule.timeSlots.filter(
                     (slot) => slot.day === dayName
                   );
           
                   daySlots.forEach((slot) => {
                     // Ensure unique keys and prevent duplicates
                     const sessionKey = `${dateString}-${slot.startTime}-${slot.endTime}`;
           
                     if (!sessions.some((session) => session.key === sessionKey)) {
                       sessions.push(
                         <div key={sessionKey} className="w-5/6 flex flex-row justify-between">
                           <div className="bg-gray-200 px-4 py-1 rounded text-sm">
                             <p>{dateString}</p>
                             <p>{slot.startTime} - {slot.endTime}</p>
                           </div>
                         </div>
                       );
                     }
                   });
                 }
           
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
  rescheduleEvent.schedule.timeSlots.length > 0 ? (
    <div className="w-full grid grid-cols-4 gap-2 mt-2">
      {rescheduleEvent.schedule.timeSlots.map((slot) => {
        const dateString = new Date(slot.date).toLocaleDateString("en-CA");
        return (
          <div key={slot._id} className="w-5/6 flex flex-row justify-between">
            <div className="bg-gray-200 px-4 py-1 rounded text-sm">
              <p>{dateString}</p>
              <p>{slot.startTime} - {slot.endTime}</p>
            </div>
            <button
              onClick={() =>
                handleEdit(rescheduleEvent, {
                  id:slot._id,
                  date: slot.date,
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })
              }
              className="m-2 px-4 py-2 bg-red-500 text-white rounded cursor-pointer"
              aria-label="Edit session"
            >
              Edit
            </button>
          </div>
        );
      })}
    </div>
  ) : rescheduleEvent.schedule.scheduleType === "One-time" &&
    rescheduleEvent.schedule.oneTimeDate ? (
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
          date: rescheduleEvent.schedule.oneTimeDate,
          startTime: rescheduleEvent.schedule.oneTimeStartTime,
          endTime: rescheduleEvent.schedule.oneTimeEndTime,
        })}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        aria-label="Edit session"
      >
        Edit One-Time Event
      </button>
    </div>
  ) : (
    <p className="text-gray-700">No scheduled sessions available.</p>
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
            min={disablePastDate()}
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





