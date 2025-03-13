import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import { FaUserCircle } from "react-icons/fa";
import CustomerDetails from "../components/CustomerDetails";

const DashNavbar = () => {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePicture, setProfilePicture] = useState(""); // Store profile pic

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("https://fitnesshub-5yf3.onrender.com/api/user-auth/profile", { withCredentials: true });
        setUsername(response.data.userName);
        setUserId(response.data._id);
        setProfilePicture(response.data.profilePicture); // Save profile pic

        // console.log("response",response)
        // console.log("response.data",response.data)
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("https://fitnesshub-5yf3.onrender.com/api/user-auth/logout", {}, { withCredentials: true });
      navigate("/customer/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="w-full bg-gray-200 text-black p-4 shadow-md flex justify-between items-center">
      {/* Left: Welcome Message */}
      <h2 className="text-lg font-semibold">Hi {username || "Guest"},</h2>

      {/* Right: Profile Icon */}
      <div className="relative">
        <button
          className="text-3xl cursor-pointer text-gray-700 hover:text-gray-900" 
          onClick={() => setShowDropdown(!showDropdown)}
          >{profilePicture ? (
            <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-blue-300 flex items-center justify-center text-gray-700 font-bold text-sm rounded-full p-2">
              {username?.charAt(0).toUpperCase()} {/* Show initials if no image */}
            </div>
          )}
          </button> 

        {/* Dropdown Menu */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg px-4 py-2 shadow-lg z-10">
             <Link to={`/customer/CustomerDashboard/CustomerDetails/${userId}`}>
                                              Profile
                                              </Link>
            <button 
              onClick={handleLogout} 
              className="block w-full text-left  py-2 text-red-600 hover:bg-gray-100"
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
