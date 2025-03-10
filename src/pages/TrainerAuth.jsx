import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Correct import
import TrainerProtectedRoute from "../components/TrainerProtectedRoute";
import TrainerLoginForm from '../components/TrainerLoginForm';
import TrainerSignupForm from '../components/TrainerSignupForm';
import TrainerRequestResetPassword from "../components/TrainerRequestResetPassword.jsx";
import TrainerResetPassword from "../components/TrainerResetPassword.jsx";
import TrainerDashboard from "./TrainerDashboard.jsx";

function TrainerAuth() {
  return (
    
      <Routes>
      <Route path="signup" element={<TrainerSignupForm />} />
        <Route path="login" element={<TrainerLoginForm />} />
        <Route path="forgot-password" element={<TrainerRequestResetPassword />} />
        <Route path="reset-password/:token" element={<TrainerResetPassword />} />
        <Route path="TrainerDashboard/*" element={<TrainerProtectedRoute />}>
    <Route path="*" element={<TrainerDashboard />} />
  </Route>
      </Routes>
   
  );
}

export default TrainerAuth;
