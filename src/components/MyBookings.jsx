import React from "react";
import cardio from "../assets/cardio.png";
import TrainerDetails from "./TrainerDetails";
import {Link, useNavigate } from "react-router-dom";


const MyBookings = () => {
  return (
    <div className="max-w-6xl mx-auto mt-10 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* {bookings.map((booking) => ( */}
          <div
            // key={booking.id}
            className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            {/* Image */}
            <img
              src={cardio}
              alt={cardio}
              className="w-32 h-32 object-cover rounded-lg mb-3"
            />

            {/* Event & Trainer Details */}
            <h3 className="text-lg font-semibold">Passport Booking</h3>
        <div className="flex flex-row w-full  justify-between">  
        <p className="text-gray-600">
  <Link to={`/customer/CustomerDashboard/mybookings/TrainerDetails`} className="text-blue-500 hover:underline">
    Agila
  </Link>
</p>
            {/* Rating, Category, Duration */}
            <p className="text-yellow-500">⭐3/5</p></div>  
            <div className="w-full flex flex-row justify-between">   <p className="text-sm text-gray-500">cardio</p>
            <p className="text-sm text-gray-500">⏳ 30mins</p></div>  

            {/* Buttons */}
            <div className="mt-4 flex justify-between gap-2 w-full">
              <button className="w-full p-2 bg-blue-400 text-white rounded hover:bg-blue-600">
                View
              </button>
              <button className="w-full p-2 bg-green-400 text-white rounded hover:bg-yellow-600">
                Reschedule
              </button>
              <button className="w-full p-2 bg-red-400 text-white rounded hover:bg-red-600">
                Cancel
              </button>
            </div>
          </div>

          <div
            // key={booking.id}
            className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            {/* Image */}
            <img
              src={cardio}
              alt={cardio}
              className="w-32 h-32 object-cover rounded-lg mb-3"
            />

            {/* Event & Trainer Details */}
            <h3 className="text-lg font-semibold">Passport Booking</h3>
        <div className="flex flex-row w-full  justify-between">    <p className="text-gray-600">Agila</p>

            {/* Rating, Category, Duration */}
            <p className="text-yellow-500">⭐3/5</p></div>  
            <div className="w-full flex flex-row justify-between">   <p className="text-sm text-gray-500">cardio</p>
            <p className="text-sm text-gray-500">⏳ 30mins</p></div>  

            {/* Buttons */}
            <div className="mt-4 flex justify-between gap-2 w-full">
              <button className="w-full p-2 bg-blue-400 text-white rounded hover:bg-blue-600">
                View
              </button>
              <button className="w-full p-2 bg-green-400 text-white rounded hover:bg-yellow-600">
                Reschedule
              </button>
              <button className="w-full p-2 bg-red-400 text-white rounded hover:bg-red-600">
                Cancel
              </button>
            </div>
          </div>

          

          
        {/* ))} */}
      </div>

      
    </div>
  );
};

export default MyBookings;
// import React from "react";

// const MyBookings = ({ bookings }) => {
//   return (
//     <div className="max-w-6xl mx-auto mt-10">
//       <h2 className="text-2xl font-semibold mb-6">My Bookings</h2>

//       {/* Grid Layout */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {bookings.map((booking) => (
//           <div
//             key={booking.id}
//             className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center"
//           >
//             {/* Image */}
//             <img
//               src={booking.eventImage}
//               alt={booking.eventName}
//               className="w-32 h-32 object-cover rounded-lg mb-3"
//             />

//             {/* Event & Trainer Details */}
//             <h3 className="text-lg font-semibold">{booking.eventName}</h3>
//             <p className="text-gray-600">By {booking.trainerName}</p>

//             {/* Rating, Category, Duration */}
//             <p className="text-yellow-500">⭐ {booking.rating}/5</p>
//             <p className="text-sm text-gray-500">{booking.category}</p>
//             <p className="text-sm text-gray-500">⏳ {booking.duration}</p>

//             {/* Buttons */}
//             <div className="mt-4 flex flex-col space-y-2 w-full">
//               <button className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//                 View
//               </button>
//               <button className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
//                 Reschedule
//               </button>
//               <button className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MyBookings;
