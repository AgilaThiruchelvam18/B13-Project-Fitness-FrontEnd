import React from "react";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center p-4 bg-white text-black">
      <h1 className="text-2xl font-bold">Fitness Hub</h1>
      <div>
        <button
          className="mr-4 bg-blue-100 hover:bg-blue-200 text-black px-4 py-2 rounded font-bold"
          onClick={() => navigate("/trainer/login")} // Add navigation for Trainer Login
        >
          Trainer Login
        </button>
        <button
          className="bg-blue-100 hover:bg-blue-200 text-black px-4 py-2 rounded font-bold"
        >
           <Link to="/customer/login">Customer Login</Link>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
