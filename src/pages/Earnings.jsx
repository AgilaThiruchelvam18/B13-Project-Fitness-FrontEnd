import React, { useEffect, useState } from "react";
import axios from "axios";

const Earnings = () => {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get("/trainer/earnings");
      setEarnings(res.data);
    } catch (error) {
      console.error("Error fetching earnings", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Earnings</h2>
      <ul>
        {earnings.map((e) => (
          <li key={e._id}>₹{e.amount} - {e.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default Earnings;
