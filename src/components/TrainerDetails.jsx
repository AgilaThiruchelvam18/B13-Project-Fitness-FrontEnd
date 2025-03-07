import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import cardio from "../assets/cardio.png";
import {Link } from "react-router-dom";


const TrainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Static Trainer Data
  const trainersData = {
    "1": {
      name: "Michael Johnson",
      image: "https://via.placeholder.com/150",
      experience: 8,
      specialization: "Weight Training, HIIT",
      email: "michael.johnson@example.com",
      phone: "+123 987 6543",
      events: [
        { name: "Strength & Conditioning", category: "Weight Training", duration: "60 mins", date: "March 20", time: "5:00 PM" },
        { name: "Fat Burn Bootcamp", category: "HIIT", duration: "45 mins", date: "March 22", time: "6:30 AM" },
      ],
    },
    "2": {
      name: "Emily Davis",
      image: "https://via.placeholder.com/150",
      experience: 6,
      specialization: "Yoga, Pilates",
      email: "emily.davis@example.com",
      phone: "+987 123 4567",
      events: [
        { name: "Sunrise Yoga", category: "Yoga", duration: "1 hour", date: "March 25", time: "7:00 AM" },
        { name: "Core Strength Pilates", category: "Pilates", duration: "50 mins", date: "March 27", time: "8:30 AM" },
      ],
    },
  };

  const trainer = trainersData[1];

  if (!trainer) {
    return <div className="text-center text-red-500 mt-10">Trainer Not Found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <button
        className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      {/* Trainer Info */}
      <div className="flex flex-col md:flex-row bg-gray-100 p-6 rounded-lg shadow-md">
        <div className="md:w-1/3 flex flex-col items-center">
          <img src={cardio} alt={trainer.name} className="w-32 h-32 rounded-full object-cover" />
          <h2 className="text-xl font-semibold mt-3">{trainer.name}</h2>
          <p className="text-gray-600">Experience: {trainer.experience} yrs</p>
          <p className="text-gray-600">Specialization: {trainer.specialization}</p>
          <p className="text-gray-600">📧 {trainer.email}</p>
          <p className="text-gray-600">📞 {trainer.phone}</p>
        </div>

        {/* Event List */}
        <div className="md:w-2/3 mt-4 md:mt-0 md:ml-6">
          <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
          {trainer.events.map((event, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow-md mb-3">
              <h4 className="text-md font-semibold">{event.name}</h4>
              <p className="text-gray-600">Category: {event.category}</p>
              <p className="text-gray-600">⏳ {event.duration}</p>
              <p className="text-gray-600">📅 {event.date} | 🕒 {event.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainerDetails;
// import React from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import cardio from "../assets/cardio.png";
// import {Link } from "react-router-dom";


// const TrainerDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // Static Trainer Data
//   const trainersData = {
//     "1": {
//       name: "Michael Johnson",
//       image: "https://via.placeholder.com/150",
//       experience: 8,
//       specialization: "Weight Training, HIIT",
//       email: "michael.johnson@example.com",
//       phone: "+123 987 6543",
//       events: [
//         { name: "Strength & Conditioning", category: "Weight Training", duration: "60 mins", date: "March 20", time: "5:00 PM" },
//         { name: "Fat Burn Bootcamp", category: "HIIT", duration: "45 mins", date: "March 22", time: "6:30 AM" },
//       ],
//     },
//     "2": {
//       name: "Emily Davis",
//       image: "https://via.placeholder.com/150",
//       experience: 6,
//       specialization: "Yoga, Pilates",
//       email: "emily.davis@example.com",
//       phone: "+987 123 4567",
//       events: [
//         { name: "Sunrise Yoga", category: "Yoga", duration: "1 hour", date: "March 25", time: "7:00 AM" },
//         { name: "Core Strength Pilates", category: "Pilates", duration: "50 mins", date: "March 27", time: "8:30 AM" },
//       ],
//     },
//   };

//   const trainer = trainersData[1];

//   if (!trainer) {
//     return <div className="text-center text-red-500 mt-10">Trainer Not Found</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-6">
//       <button
//         className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//         onClick={() => navigate(-1)}
//       >
//         ← Back
//       </button>

//       {/* Trainer Info */}
//       <div className="flex flex-col md:flex-row bg-gray-100 p-6 rounded-lg shadow-md">
//         <div className="md:w-1/3 flex flex-col items-center">
//           <img src={cardio} alt={trainer.name} className="w-32 h-32 rounded-full object-cover" />
//           <h2 className="text-xl font-semibold mt-3">{trainer.name}</h2>
//           <p className="text-gray-600">Experience: {trainer.experience} yrs</p>
//           <p className="text-gray-600">Specialization: {trainer.specialization}</p>
//           <p className="text-gray-600">📧 {trainer.email}</p>
//           <p className="text-gray-600">📞 {trainer.phone}</p>
//         </div>

//         {/* Event List */}
//         <div className="md:w-2/3 mt-4 md:mt-0 md:ml-6">
//           <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
//           {trainer.events.map((event, index) => (
//             <div key={index} className="p-4 bg-white rounded-lg shadow-md mb-3">
//               <h4 className="text-md font-semibold">{event.name}</h4>
//               <p className="text-gray-600">Category: {event.category}</p>
//               <p className="text-gray-600">⏳ {event.duration}</p>
//               <p className="text-gray-600">📅 {event.date} | 🕒 {event.time}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrainerDetails;
