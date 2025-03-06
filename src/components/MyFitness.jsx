const MyFitness = () => {
    return (
      <div className="w-2/3 grid grid-cols-3 gap-4 p-6">
        {["Yoga", "Cardio", "Strength Training", "Zumba", "Meditation", "Nutrition"].map((item) => (
          <div key={item} className="bg-gray-200 p-4 rounded-lg">{item}</div>
        ))}
      </div>
    );
  };
  
  export default MyFitness;
  