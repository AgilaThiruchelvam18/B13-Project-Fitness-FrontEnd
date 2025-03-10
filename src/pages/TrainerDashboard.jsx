import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Classes from "./Classes";
// import Schedule from "./Schedule";
// import Bookings from "./Bookings";
// import Earnings from "./Earnings";
// import Profile from "./Profile";
import Sidebar from "../components/Sidebar";
import TrainerProtectedRoute from "../components/TrainerProtectedRoute";

function TrainerDashboard() {
  return (
    
      <div className="flex">
        <Sidebar />
        <div className="p-6">
          <Routes>
            <Route path="classes" element={<Classes />} />
            {/* <Route path="schedule" element={<TrainerProtectedRoute><Schedule /></TrainerProtectedRoute>} />
            <Route path="bookings" element={<TrainerProtectedRoute><Bookings /></TrainerProtectedRoute>} />
            <Route path="earnings" element={<TrainerProtectedRoute><Earnings /></TrainerProtectedRoute>} />
            <Route path="profile" element={<TrainerProtectedRoute><Profile /></TrainerProtectedRoute>} /> */}
          </Routes>
        </div>
      </div>
   
  );
}

export default TrainerDashboard;
