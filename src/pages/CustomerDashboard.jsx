import { Routes, Route } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashNavbar from "../components/DashNavbar";
import DashPage from "../components/DashPage";
import MyFitness from "../components/MyFitness";
import MyBookings from "../components/MyBookings";
import BookingHistory from "../components/BookingHistory";
import UpcomingClasses from "../components/UpcomingClasses";
import TrainersList from "../components/TrainersList";
import TrainerDetails from "../components/TrainerDetails";
import ProtectedRoute from "../components/ProtectedRoute"; // Ensure protected access
import { useEffect } from "react";
import CustomerDetails from "../components/CustomerDetails";


//import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <DashSidebar />

      {/* Main Content */}
      <div className="flex flex-col w-4/5 bg-gray-50">
        <DashNavbar />

        {/* Page Content */}
        <DashPage>
          <Routes>
            <Route path="myfitness" element={<MyFitness />} />
            <Route path="myfitness/trainerslist/:category" element={<TrainersList />} />   
           <Route path="mybookings" element={<MyBookings />} />
           <Route path="TrainerDetails/:id" element={<TrainerDetails />} />
           <Route path="CustomerDetails/:id" element={<CustomerDetails />} />
            <Route path="bookinghistory" element={<BookingHistory />} />
            <Route path="upcomingclasses" element={<UpcomingClasses />} />
            
          </Routes>
        </DashPage>
        
      </div>
    </div>
  );
};

export default CustomerDashboard;
