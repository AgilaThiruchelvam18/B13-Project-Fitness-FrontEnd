import React from "react";

const CardItem = ({ title, description,color,backgroundImage }) => {
  console.log(backgroundImage);
  return (
    <div className={`flex  object-cover p-4 gap-4 rounded shadow-md text-center ${color}`}>
     <div className="my-auto"><img src={backgroundImage} alt="image" className="mx-auto rounded-lg "/></div> 
     <div className="flex-col p-4 text-center"> 
        <h2 className="text-2xl font-bold">{title}</h2>
      </div> 
    </div>
  );
};

export default CardItem;
