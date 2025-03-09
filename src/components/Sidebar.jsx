import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <nav className="w-64 bg-gray-800 text-white min-h-screen p-5">
      <h2 className="text-lg font-bold mb-6">Trainer Dashboard</h2>
      <ul>
        {/* <li className="mb-3"><Link to="/dashboard">Dashboard</Link></li> */}
        <li className="mb-3"><Link to="/trainer/TrainerDashboard/classes">Manage Classes</Link></li>
        <li className="mb-3"><Link to="/trainer/TrainerDashboard/schedule">Schedule</Link></li>
        <li className="mb-3"><Link to="/trainer/TrainerDashboard/bookings">Bookings</Link></li>
        <li className="mb-3"><Link to="/trainer/TrainerDashboard/earnings">Earnings</Link></li>
        <li className="mb-3"><Link to="/trainer/TrainerDashboard/profile">Profile</Link></li>
      </ul>
    </nav>
  );
};

export default Sidebar;
