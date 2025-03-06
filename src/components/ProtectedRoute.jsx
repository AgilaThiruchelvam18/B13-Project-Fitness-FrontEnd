import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get("https://fitnesshub-5yf3.onrender.com/api/customer/dashboard", { 
          withCredentials: true 
        });
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Stop loading once the check is done
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; // Prevents immediate redirection

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
