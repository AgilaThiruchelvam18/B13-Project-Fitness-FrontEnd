import { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("https://fitnesshub-5yf3.onrender.com/api/customer/dashboard", { 
          withCredentials: true // ✅ Ensures cookies are sent
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; // ✅ Prevents instant redirect while checking auth
  if (isAuthenticated === false) return <Navigate to="/customer/login" />; // ✅ Redirect to login if not authenticated

  return <Outlet />; // ✅ Renders protected content if authenticated
};

export default ProtectedRoute;
;