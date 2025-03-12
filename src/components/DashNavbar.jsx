import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { FaUserCircle } from "react-icons/fa";

const DashNavbar = () => {
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("https://fitnesshub-5yf3.onrender.com/api/user-auth/profile", { withCredentials: true });
        setUsername(response.data);
        console.log("response",response)
        console.log("username",username)
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("https://fitnesshub-5yf3.onrender.com/api/auth/logout", {}, { withCredentials: true });
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="w-full bg-gray-200 text-black p-4 shadow-md flex justify-between items-center">
      {/* Left: Welcome Message */}
      <h2 className="text-lg font-semibold">Hi, {username || "Guest"}</h2>

      {/* Right: Profile Icon */}
      <div className="relative">
        <button
          className="text-3xl cursor-pointer text-gray-700 hover:text-gray-900" 
          onClick={() => setShowDropdown(!showDropdown)}
          >pro</button> 

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
            <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
              Profile
            </Link>
            <button 
              onClick={handleLogout} 
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashNavbar;
