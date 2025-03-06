import { useEffect, useState } from "react";
import axios from "axios";

const DashNavbar = () => {
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("https://fitnesshub-5yf3.onrender.com/api/customer/dashboard", { withCredentials: true });
        setUsername(data.user.userName);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full bg-blue-500 text-white p-4">
      <h2>Hi, {username}</h2>
    </div>
  );
};

export default DashNavbar;
