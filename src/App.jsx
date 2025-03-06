import React from "react";
import Home from "./pages/Home";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // ✅ Correct import
import CustomerAuth from './pages/CustomerAuth.jsx';
import TrainerAuth from "./pages/TrainerAuth.jsx";
function App() {
  return (
    <div>
   
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/customer/*" element={<CustomerAuth />} />
      <Route path="/trainer/*" element={<TrainerAuth />} />
      </Routes>    
    
          </div>
  );
}

export default App;
