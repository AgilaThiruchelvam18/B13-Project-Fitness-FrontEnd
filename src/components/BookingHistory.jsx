import React from "react";
import cardio from "../assets/cardio.png";
import TrainerDetails from "./TrainerDetails";
import {Link, useNavigate } from "react-router-dom";

const BookingHistory = () => {
  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4">Booking History</h2>
      <div className="space-y-4">
        {/* {bookings.map((booking) => ( */}
          <div
            // key={booking.id}
            className="flex flex-row bg-white p-4 rounded-lg shadow-md items-center"
          >
            {/* Left: Trainer Image */}
            <img
              src={cardio}
              alt="Trainer"
              className="w-24 h-24 rounded-full object-cover border"
            />

            {/* Middle: Trainer & Event Details */}
            <div className="flex flex-col flex-1 px-4">
            <p className="text-gray-600">
  <Link to={`/customer/CustomerDashboard/mybookings/TrainerDetails`} className="text-blue-500 hover:underline">
    Agila
  </Link>
</p>
              <p className="text-gray-600">Passport Booking</p>
              <p className="text-sm text-gray-500">Duration: 1m 3h</p>
              <p className="text-sm text-gray-500">Category:yoga</p>
              {/* <h3 className="text-lg font-semibold">{booking.trainerName}</h3>
              <p className="text-gray-600">{booking.eventDetails}</p>
              <p className="text-sm text-gray-500">Duration: {booking.duration}</p>
              <p className="text-sm text-gray-500">Category: {booking.category}</p> */}
            </div>

            {/* Right: Rating & Feedback */}
            <div className="flex flex-col items-end">
              <p className="text-yellow-500 text-lg">⭐ /5</p>
              {/* <p className="text-yellow-500 text-lg">⭐ {booking.rating}/5</p> */}
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Give Feedback
              </button>
            </div>
          </div>
          
        {/* ))} */}
      </div>
    </div>
  );
};

export default BookingHistory;

// import React from "react";

// const BookingHistory = ({ bookings }) => {
//   return (
//     <div className="max-w-4xl mx-auto mt-10">
//       <h2 className="text-2xl font-semibold mb-4">Booking History</h2>
//       <div className="space-y-4">
//         {bookings.map((booking) => (
//           <div
//             key={booking.id}
//             className="flex flex-row bg-white p-4 rounded-lg shadow-md items-center"
//           >
//             {/* Left: Trainer Image */}
//             <img
//               src={booking.trainerImage}
//               alt="Trainer"
//               className="w-24 h-24 rounded-full object-cover border"
//             />

//             {/* Middle: Trainer & Event Details */}
//             <div className="flex flex-col flex-1 px-4">
//               <h3 className="text-lg font-semibold">{booking.trainerName}</h3>
//               <p className="text-gray-600">{booking.eventDetails}</p>
//               <p className="text-sm text-gray-500">Duration: {booking.duration}</p>
//               <p className="text-sm text-gray-500">Category: {booking.category}</p>
//             </div>

//             {/* Right: Rating & Feedback */}
//             <div className="flex flex-col items-end">
//               <p className="text-yellow-500 text-lg">⭐ {booking.rating}/5</p>
//               <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
//                 Give Feedback
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default BookingHistory;
