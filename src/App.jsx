import React from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Correct import
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import RequestResetPassword from "./components/RequestResetPassword.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import Dashboard from "./components/Dashboard.jsx";
import TrainerLoginForm from './components/TrainerLoginForm';
import TrainerSignupForm from './components/TrainerSignupForm';
import TrainerRequestResetPassword from "./components/TrainerRequestResetPassword.jsx";
import TrainerResetPassword from "./components/TrainerResetPassword.jsx";
import TrainerDashboard from "./components/TrainerDashboard.jsx";
function App() {
  return (
    <div>
      
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/customer/signup" element={<SignupForm />} />
        <Route path="/customer/login" element={<LoginForm />} />
        <Route path="/customer/forgot-password" element={<RequestResetPassword />} />
        <Route path="/customer/reset-password/:token" element={<ResetPassword />} />
        <Route path="/customer/dashboard" element={<Dashboard />} />
        <Route path="/trainer/signup" element={<TrainerSignupForm />} />
        <Route path="/trainer/login" element={<TrainerLoginForm />} />
        <Route path="/trainer/forgot-password" element={<TrainerRequestResetPassword />} />
        <Route path="/trainer/reset-password/:token" element={<TrainerResetPassword />} />
        <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
      </Routes>
    
      
    </div>
  );
}

export default App;
