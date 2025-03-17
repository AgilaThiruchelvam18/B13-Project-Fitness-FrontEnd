import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Classes from "./Classes";
import TrainerDashNavbar from "../components/TrainerDashNavbar";
import DashPage from "../components/DashPage";
import TrainerInfo from "../components/TrainerInfo";

// import Schedule from "./Schedule";
// import Bookings from "./Bookings";
// import Earnings from "./Earnings";
// import Profile from "./Profile";
import Sidebar from "../components/Sidebar";
// import TrainerProtectedRoute from "../components/TrainerProtectedRoute";

function TrainerDashboard() {
  return (
    <div className="flex  w-full h-screen overflow-y-auto">
    {/* Sidebar */}
    <Sidebar />

    {/* Main Content */}
    <div className="flex flex-col w-full bg-gray-50 h-screen overflow-y-auto">
      <TrainerDashNavbar />

      {/* Page Content */}
      <DashPage>
      <Routes>
            <Route path="classes" element={<Classes />} />
            <Route path="profile" element={<TrainerInfo />} />
            <Route path="/TrainerInfo/:id" element={<TrainerInfo />} />

      //       {/* <Route path="schedule" element={<TrainerProtectedRoute><Schedule /></TrainerProtectedRoute>} />
      //       <Route path="bookings" element={<TrainerProtectedRoute><Bookings /></TrainerProtectedRoute>} />
      //       <Route path="earnings" element={<TrainerProtectedRoute><Earnings /></TrainerProtectedRoute>} />
      //       <Route path="profile" element={<TrainerProtectedRoute><Profile /></TrainerProtectedRoute>} /> */}
          </Routes>
      </DashPage>
      
    </div>
  </div>
     
   
  );
}

export default TrainerDashboard;
