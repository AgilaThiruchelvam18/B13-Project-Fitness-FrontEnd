import { Link } from "react-router-dom";

const DashSidebar = () => {
  return (
    <div className="w-1/5 bg-gray-100 text-black h-screen p-5">
      <h2 className="text-lg font-bold mb-6">Dashboard</h2>
      <ul>
      <li className="mb-4"><Link to="/customer/CustomerDashboard/myfitness">Fitness Coaches</Link></li>
        <li className="mb-4"><Link to="/customer/CustomerDashboard/mybookings">My Bookings</Link></li>
        <li className="mb-4"><Link to="/customer/CustomerDashboard/bookinghistory">Booking History</Link></li>
        <li className="mb-4"><Link to="/customer/CustomerDashboard/upcomingclasses">Upcoming Classes</Link></li>
      </ul>
    </div>
  );
};

export default DashSidebar;
