import { Link } from "react-router-dom";

const DashSidebar = () => {
  return (
    <div className="w-1/5 bg-gray-800 text-white h-screen p-5">
      <h2 className="text-lg font-bold mb-6">Dashboard</h2>
      <ul>
      <li className="mb-4"><Link to="/dashboard/myfitness">My Fitness</Link></li>
        <li className="mb-4"><Link to="/dashboard/mybookings">My Bookings</Link></li>
        <li className="mb-4"><Link to="/dashboard/bookinghistory">Booking History</Link></li>
        <li className="mb-4"><Link to="/dashboard/upcomingclasses">Upcoming Classes</Link></li>
      </ul>
    </div>
  );
};

export default DashSidebar;
