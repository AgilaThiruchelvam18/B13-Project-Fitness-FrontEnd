import DashSidebar from "../components/DashSidebar";
import DashNavbar from "../components/DashNavbar";
import { Routes, Route } from "react-router-dom";
import MyFitness from "../components/MyFitness";
import MyBookings from "../components/MyBookings";
import BookingHistory from "../components/BookingHistory";
import UpcomingClasses from "../components/UpcomingClasses";

const CustomerDashboard = () => {
  return (
    <div className="flex">
      <DashSidebar />
      <div className="w-4/5">
        <DashNavbar />
        <div className="p-6">
          <Routes>
            <Route path="myfitness" element={<MyFitness />} />
            <Route path="mybookings" element={<MyBookings />} />
            <Route path="bookinghistory" element={<BookingHistory />} />
            <Route path="upcomingclasses" element={<UpcomingClasses />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
