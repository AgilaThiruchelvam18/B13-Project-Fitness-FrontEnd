import React from "react";
import Navbar from "../components/Navbar";
import GridItem from "../components/GridItem";
import "@fontsource/poppins";
import cardio from "../assets/cardio.png";
import zumba from "../assets/zumba.png";
import strength from "../assets/strength.png";
import yoga from "../assets/yoga.png";
import nutrition from "../assets/nutrition.png";
import meditation from "../assets/meditation.png";

const Home = () => {
    const items = [
        { title: "Yoga", description: "Enhance flexibility and peace of mind.", color: "bg-green-100",backgroundImage:yoga },
        { title: "Cardio", description: "Boost heart health with intense workouts.", color: "bg-red-100",backgroundImage:cardio },
        { title: "Strength Training", description: "Build muscle and endurance.", color: "bg-blue-100",backgroundImage:strength },
        { title: "Zumba", description: "Dance your way to fitness.", color: "bg-purple-200",backgroundImage:zumba  },
        { title: "Meditation", description: "Relax and focus your mind.", color: "bg-orange-100",backgroundImage:meditation },
        { title: "Nutrition", description: "Eat right to stay fit.", color: "bg-fuchsia-200",backgroundImage:nutrition},
      ];

  return (
    <div className="w-full bg-gray-100 font-poppins">
      <Navbar />
      <div className="text-center p-4">   

      <div className="text-center my-8 px-4">
        <p className="text-5xl font-bold">Welcome to Fitness Hub - Your Ultimate Fitness Destination</p>
      </div>
      <div className="w-5/6 mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8">
        {items.map((item, index) => (
          <GridItem key={index} title={item.title} description={item.description} color=
          {item.color} backgroundImage={item.backgroundImage} />
        ))}
      </div>
      </div>
      </div>
    </div>
  );
};

export default Home;
