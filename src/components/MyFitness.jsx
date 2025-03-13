import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import CardItem from "../components/CardItem";
import "@fontsource/poppins";
import cardio from "../assets/cardio-mini.png";
import zumba from "../assets/zumba-mini.png";
import strength from "../assets/strength-mini.png";
import yoga from "../assets/yoga-mini.png";
import nutrition from "../assets/nutrition-mini.png";
import meditation from "../assets/meditation-mini.png";

const MyFitness = () => {
  const [recommendedClasses, setRecommendedClasses] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await axios.get("https://fitnesshub-5yf3.onrender.com/api/user-auth/profile", { withCredentials: true });
        setUserId(response.data._id);
     

      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return; // Ensure userId is available
  
    console.log("Fetching recommendations for userId:", userId); // Debugging log
  
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get(`https://fitnesshub-5yf3.onrender.com/api/recommendations/${userId}`, {
          withCredentials: true,
        });
  
        console.log("Fetched recommendations:", response.data);
        console.log("recommendedClasses:", recommendedClasses);

        setRecommendedClasses(response.data.recommendedClasses || []);
      } catch (error) {
        console.error("Error fetching recommended classes:", error.response?.data || error.message);
      }
    };
  
    fetchRecommendations();
  }, [userId]);
  

  const categories = [
    { title: "Yoga", description: "Enhance flexibility and peace of mind.", color: "bg-green-100", backgroundImage: yoga, categorytype: "yoga" },
    { title: "Cardio", description: "Boost heart health with intense workouts.", color: "bg-red-100", backgroundImage: cardio, categorytype: "cardio" },
    { title: "Strength Training", description: "Build muscle and endurance.", color: "bg-blue-100", backgroundImage: strength, categorytype: "strength" },
    { title: "Zumba", description: "Dance your way to fitness.", color: "bg-purple-200", backgroundImage: zumba, categorytype: "zumba" },
    { title: "Meditation", description: "Relax and focus your mind.", color: "bg-orange-100", backgroundImage: meditation, categorytype: "meditation" },
    { title: "Nutrition", description: "Eat right to stay fit.", color: "bg-fuchsia-200", backgroundImage: nutrition, categorytype: "nutrition" },
  ];

  return (
    <div className="w-full h-screen flex flex-col p-4">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
        {categories.map((category, index) => (
          <Link to={`/customer/CustomerDashboard/myfitness/trainerslist/${category.categorytype}`} key={index}>
            <CardItem title={category.title} color={category.color} backgroundImage={category.backgroundImage} />
          </Link>
        ))}
      </div>

      <div className="w-full bg-white p-2 overflow-x-auto">
        <h2 className="text-lg font-semibold my-2">Recommended Classes</h2>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
          {recommendedClasses.length > 0 ? (
            recommendedClasses.map((classItem, index) => (
              <div key={index} className="flex flex-col justify-between gap-2 object-cover rounded shadow-md text-center bg-gray-200 p-2">
                {/* <img src={classItem.image || classItem.fallbackImage} alt="class" className="mx-auto rounded-lg" /> */}
                <h1 className="text-lg font-bold">{classItem.title}</h1>
                <div className="flex justify-between">
                  <h1 className="text-md">{classItem.trainer.userName}</h1>
                  <p className="text-md">{classItem.trainer.ratings.averageRating|| "N/A"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-md">{classItem.category}</p>
                  <p className="text-md">{classItem.duration}mins</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No recommendations available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyFitness;
