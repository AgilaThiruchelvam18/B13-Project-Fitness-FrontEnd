import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import cardio from "../assets/cardio.png";

const TrainerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrainerDetails = async () => {
      try {
        const res = await axios.get(`https://fitnesshub-5yf3.onrender.com/api/trainers/${id}`, {
          withCredentials: true,
        });
        setTrainer(res.data);
        console.log("res.data",res.data);
      } catch (err) {
        setError("Trainer not found!");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainerDetails();
  }, [id]);

  if (loading) return <div className="text-center text-gray-600 mt-10">Loading trainer details...</div>;
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6">
      <button className="mb-4 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* Trainer Info */}
      <div className="flex flex-col md:flex-row bg-gray-100 p-6 rounded-lg shadow-md overflow-y-auto">
        <div className="md:w-1/3 flex flex-col items-center">
          <img src={trainer.image || cardio} alt={trainer.name} className="w-32 h-32 rounded-full object-cover" />
          <h2 className="text-xl font-semibold mt-3">{trainer.userName}</h2>
          <p className="text-gray-600">Experience: {trainer.experience} yrs</p>
          <p className="text-gray-600">Specialization: {trainer.specialization}</p>
          <p className="text-gray-600">📧 {trainer.email}</p>
          <p className="text-gray-600">📞 {trainer.phone}</p>
        </div>

        {/* Trainer's Created Classes */}
        <div className="max-h-[300px] md:w-2/3 mt-4 md:mt-0 md:ml-6 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-2 ">Upcoming Classes</h3>
          {trainer.classes?.length > 0 ? (
            trainer.classes.map((cls, index) => (
              <div key={index} className="p-4 bg-white rounded-lg shadow-md mb-3">
                <h4 className="text-md font-semibold">{cls.title}</h4>
                <p className="text-gray-600">Category: {cls.category}</p>
                <p className="text-gray-600">⏳ {cls.duration} mins</p>
                <p className="text-gray-600">📅 {new Date(cls.timeSlots[0].date).toLocaleDateString()}  |  {cls.timeSlots[0].time}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No upcoming classes.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerDetails;
