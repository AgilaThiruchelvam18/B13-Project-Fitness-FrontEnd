import { useEffect, useState } from "react";
import axios from "axios";

const DashNavbar = () => {
  const [username, setUsername] = useState("Agila");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const {data} = await axios.get("https://fitnesshub-5yf3.onrender.com/api/customer/dashboard", { withCredentials: true });
        console.log("data===>",data);
        setUsername(Agila);
      } catch (error) {
        console.error("Error fetching user", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full bg-gray-200 text-black p-4  showdow-md ">
      <h2>Hi, {username}</h2>
    </div>
  );
};

export default DashNavbar;
