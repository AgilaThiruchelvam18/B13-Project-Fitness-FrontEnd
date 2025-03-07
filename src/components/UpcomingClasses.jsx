import React from "react";
import cardio from "../assets/cardio.png"; // Sample image
import TrainerDetails from "./TrainerDetails";
import {Link, useNavigate } from "react-router-dom";


const UpcomingClasses = () => {
  return (
    <div className="max-w-6xl mx-auto mt-10 overflow-y-auto">
      <h2 className="text-2xl font-semibold mb-6">Upcoming Classes</h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Sample Class Box */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
          {/* Image */}
          <img
            src={cardio}
            alt="cardio"
            className="w-32 h-32 object-cover rounded-lg mb-3"
          />

          {/* Event & Trainer Details */}
          <h3 className="text-lg font-semibold">Yoga Class</h3>
          <div className="flex flex-row w-full justify-between">
          <p className="text-gray-600">
  <Link to={`/customer/CustomerDashboard/mybookings/TrainerDetails`} className="text-blue-500 hover:underline">
    Agila
  </Link>
</p>
            <p className="text-yellow-500">⭐ 4.5/5</p>
          </div>
          <div className="w-full flex flex-row justify-between">
            <p className="text-sm text-gray-500"> Cardio</p>
            <p className="text-sm text-gray-500">⏳ 45 mins</p>
          </div>

          {/* Book Now Button */}
          <div className="mt-4 w-full">
            <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-green-600">
              Book Now
            </button>
          </div>
        </div>

        {/* Duplicate for another sample class */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center">
          {/* Image */}
          <img
            src={cardio}
            alt="cardio"
            className="w-32 h-32 object-cover rounded-lg mb-3"
          />

          {/* Event & Trainer Details */}
          <h3 className="text-lg font-semibold">Zumba Class</h3>
          <div className="flex flex-row w-full justify-between">
          <p className="text-gray-600">
  <Link to={`/customer/CustomerDashboard/mybookings/TrainerDetails`} className="text-blue-500 hover:underline">
    Agila
  </Link>
</p>
            <p className="text-yellow-500">⭐ 4.2/5</p>
          </div>
          <div className="w-full flex flex-row justify-between">
            <p className="text-sm text-gray-500"> Dance</p>
            <p className="text-sm text-gray-500">⏳ 1 Hour</p>
          </div>

          {/* Book Now Button */}
          <div className="mt-4 w-full">
            <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-green-600">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingClasses;
