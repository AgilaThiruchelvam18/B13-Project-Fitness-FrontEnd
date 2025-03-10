import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Correct import
import CustomerProtectedRoute from "../components/ProtectedRoute";
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import RequestResetPassword from "../components/RequestResetPassword.jsx";
import ResetPassword from "../components/ResetPassword.jsx";
import CustomerDashboard from "./CustomerDashboard.jsx";

function CustomerAuth() {
  return (
    
      <Routes>
        <Route path="signup" element={<SignupForm />} />
        <Route path="login" element={<LoginForm />} />
        <Route path="forgot-password" element={<RequestResetPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="CustomerDashboard/*" element={<CustomerProtectedRoute />}>
    <Route path="*" element={<CustomerDashboard />} />
  </Route>
      </Routes>
    
  );
}

export default CustomerAuth;
