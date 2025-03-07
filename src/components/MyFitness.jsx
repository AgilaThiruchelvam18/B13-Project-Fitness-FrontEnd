import React from "react";
import Navbar from "../components/Navbar";
import CardItem from "../components/CardItem";
import "@fontsource/poppins";
import cardio from "../assets/cardio-mini.png";
import zumba from "../assets/zumba-mini.png";
import strength from "../assets/strength-mini.png";
import yoga from "../assets/yoga-mini.png";
import nutrition from "../assets/nutrition-mini.png";
import meditation from "../assets/meditation-mini.png";
import class1 from "../assets/cardio.png";
import class2 from "../assets/zumba.png";

const MyFitness = () => {

const categories = [
  { title: "Yoga", description: "Enhance flexibility and peace of mind.", color: "bg-green-100",backgroundImage:yoga },
  { title: "Cardio", description: "Boost heart health with intense workouts.", color: "bg-red-100",backgroundImage:cardio },
  { title: "Strength Training", description: "Build muscle and endurance.", color: "bg-blue-100",backgroundImage:strength },
  { title: "Zumba", description: "Dance your way to fitness.", color: "bg-purple-200",backgroundImage:zumba  },
  { title: "Meditation", description: "Relax and focus your mind.", color: "bg-orange-100",backgroundImage:meditation },
  { title: "Nutrition", description: "Eat right to stay fit.", color: "bg-fuchsia-200",backgroundImage:nutrition},
];

return (
  <div className="w-full max-h-full flex flex-col flex-end p-4 ">
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
      {categories.map((category, index) => (
        <CardItem key={index} title={category.title} color=
        {category.color} backgroundImage={category.backgroundImage} />
      ))}
    </div>
    
    <div className=" w-full  bg-white rounded-lg  shadow-md p-2 overflow-x-auto">
      <h2 className="text-lg font-semibold my-2">Recommended Classes</h2>
     <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ">
<div className="flex flex-col justify-between gap-2 object-cover rounded shadow-md text-center bg-gray-200 p-2">
<img src={class1} alt="image" className="mx-auto rounded-lg "/>
<h1>Event Name</h1>
<div className="flex justify-between">
<h1>Trainer Name</h1>
<p>5</p>
</div>
<p>Category</p>
</div>
<div className="flex flex-col justify-between object-cover rounded shadow-md text-center p-2 bg-gray-200">
<img src={class2} alt="image" className="mx-auto rounded-lg "/>
<h1>Event Name</h1>
<div className="flex justify-between">
<h1>Trainer Name</h1>
<p>5</p>
</div>
<p>Category</p>
</div>

     </div>
    </div>
  </div>
);
};

export default MyFitness;
