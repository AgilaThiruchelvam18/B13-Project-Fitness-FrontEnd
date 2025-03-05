import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Correct import
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import RequestResetPassword from "../components/RequestResetPassword.jsx";
import ResetPassword from "../components/ResetPassword.jsx";
import Dashboard from "../components/Dashboard.jsx";

function CustomerAuth() {
  return (
    <Router>
      <Routes>
        <Route path="/customer/signup" element={<SignupForm />} />
        <Route path="/customer/login" element={<LoginForm />} />
        <Route path="/customer/forgot-password" element={<RequestResetPassword />} />
        <Route path="/customer/reset-password/:token" element={<ResetPassword />} />
        <Route path="/customer/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default CustomerAuth;
