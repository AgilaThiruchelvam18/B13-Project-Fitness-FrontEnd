import React from "react";

const GridItem = ({ title, description,color,backgroundImage }) => {
  console.log(backgroundImage);
  return (
    <div className={`flex flex-col justify-between object-cover p-2 gap-4 rounded shadow-md text-center ${color}`}>
      <img src={backgroundImage} alt="image" className="mx-auto rounded-lg "/>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="text-md mt-2">{description}</p>
    </div>
  );
};

export default GridItem;
