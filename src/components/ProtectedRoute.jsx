import { useState } from "react";
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
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) return <div>Loading...</div>; // Prevents instant redirect
  if (isAuthenticated === false) return <Navigate to="/customer/login" />; // Redirect only if false

  return <Outlet />;
};
export default ProtectedRoute;