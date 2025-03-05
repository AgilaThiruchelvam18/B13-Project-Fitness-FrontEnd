import { Link, useNavigate } from "react-router-dom";
// import Login from "./Login";

function Dashboard(){
  // const navigate = useNavigate();
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
       <div className="flex flex-row justify-between"><h2 className="text-2xl font-bold text-center mb-4">Dashboard</h2>
          <Link to="/login">Back</Link></div>   
          <p className="text-green-500 text-center">Welcome to the dashboard</p>
        </div>
      </div>
    );
}
export default Dashboard;