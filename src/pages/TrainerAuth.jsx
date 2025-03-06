import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Correct import
import ProtectedRoute from "../components/ProtectedRoute";
import TrainerLoginForm from '../components/TrainerLoginForm';
import TrainerSignupForm from '../components/TrainerSignupForm';
import TrainerRequestResetPassword from "../components/TrainerRequestResetPassword.jsx";
import TrainerResetPassword from "../components/TrainerResetPassword.jsx";
import TrainerDashboard from "../pages/TrainerDashboard.jsx";

function TrainerAuth() {
  return (
    
      <Routes>
      <Route path="signup" element={<TrainerSignupForm />} />
        <Route path="login" element={<TrainerLoginForm />} />
        <Route path="forgot-password" element={<TrainerRequestResetPassword />} />
        <Route path="reset-password/:token" element={<TrainerResetPassword />} />
        <Route path="dashboard/*" element={<ProtectedRoute />}>
    <Route path="" element={<TrainerDashboard />} />
  </Route>
      </Routes>
   
  );
}

export default TrainerAuth;
