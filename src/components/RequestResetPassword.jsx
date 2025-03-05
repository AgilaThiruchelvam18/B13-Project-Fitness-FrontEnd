import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    try {
      await axios.post("http://fitnesshub-5yf3.onrender.com/api/user-auth/request-password-reset", { email });
      setMessage("Check your email for reset link.");
      // setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setMessage("Failed to send reset link.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}
        <input type="email" placeholder="Enter email" className="border p-2 w-full" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={handleReset} className="mt-4 bg-blue-500 text-white py-2 w-full">Send Reset Link</button>
      </div>
    </div>
  );
};

export default RequestResetPassword;
