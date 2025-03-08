import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios"; // Import Axios

const categoryContent = {
  all: {
    title: "ALL FITNESS & NUTRITION COACHES",
    description: "Browse all expert trainers across different fitness categories.",
    stats: "⭐ 100,000+ 5-star reviews | 💪 1,000,000+ transformations",
  },
  cardio: {
    title: "CARDIO COACHES",
    description: "Boost endurance, improve heart health, and burn calories with expert cardio coaching.",
    stats: "🔥 50,000+ happy clients | 🏃 500,000+ km run | 💪 10,000+ cardio sessions completed",
  },
  yoga: {
    title: "YOGA INSTRUCTORS",
    description: "Enhance flexibility, mindfulness, and relaxation with expert yoga guidance.",
    stats: "🧘 30,000+ yogis transformed | 🌿 200,000+ hours of meditation | 💖 95% satisfaction rate",
  },
  strength: {
    title: "STRENGTH TRAINING COACHES",
    description: "Build muscle, gain strength, and boost performance with expert coaching.",
    stats: "🏋️ 100,000+ kg lifted | 💪 50,000+ transformations | 🏆 1,000+ strength competitions won",
  },
  zumba: {
    title: "ZUMBA COACHES",
    description: "Dance your way to fitness with high-energy, fun-filled Zumba sessions.",
    stats: "💃 40,000+ dance lovers | 🔥 200,000+ Zumba sessions | 🎶 10,000+ hours of music",
  },
  meditation: {
    title: "MEDITATION COACHES",
    description: "Find inner peace, reduce stress, and enhance focus with expert-guided meditation.",
    stats: "🕊️ 20,000+ minds at peace | 🧘 500,000+ meditation hours | ☯️ 98% stress reduction success",
  },
  nutrition: {
    title: "NUTRITION EXPERTS",
    description: "Eat right, stay fit, and achieve your wellness goals with expert nutrition plans.",
    stats: "🥗 100,000+ meal plans created | 🍏 500,000+ healthy meals served | 💖 99% diet satisfaction",
  },
};

const TrainersList = () => {
  const { category: urlCategory } = useParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch trainers using Axios
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        setLoading(true);
        const response = await axios.get("https://fitnesshub-5yf3.onrender.com/api/trainers");
        setTrainers(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch trainers");
      } finally {
        setLoading(false);
      }
    };

    fetchTrainers();
  }, []);

  useEffect(() => {
    setSelectedCategory(urlCategory ? urlCategory.toLowerCase() : "all");
  }, [urlCategory]);

  const content = categoryContent[selectedCategory] || categoryContent["all"];
console.log("Trainers",trainers)
console.log("urlCategory",urlCategory)
  // Filter trainers based on selected category
  const filteredTrainers =
  selectedCategory === "all"
    ? trainers
    : trainers.filter((trainer) =>
        trainer.expertise.some((exp) => exp.toLowerCase() === selectedCategory.toLowerCase())
      );


  return (
    <div className="max-w-6xl mx-auto mt-10 p-6">
      {/* Category Filter Buttons */}
      <div className="flex justify-center space-x-4 mb-8">
        {Object.keys(categoryContent).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              selectedCategory === cat
                ? "bg-blue-500 text-white shadow-md"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Dynamic Category Content */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">{content.title}</h1>
        <p className="text-gray-600 mt-2">{content.description}</p>
        <p className="mt-4 text-blue-600 font-semibold text-lg">{content.stats}</p>
      </div>

      {/* Loading & Error Handling */}
      {loading && <p className="text-center text-gray-600">Loading trainers...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {filteredTrainers.length > 0 ? (
          filteredTrainers.map((trainer) => (
            <div
              key={trainer.id}
              className="bg-gray-100 p-4 rounded-lg shadow-md flex flex-col items-center text-center"
            >
              {/* Trainer Image */}
              <img
                src={trainer.coverMedia?.url || "https://via.placeholder.com/150"}
                alt={trainer.userName}
                className="w-32 h-32 object-cover rounded-full mb-3"
              />

              {/* Trainer Name & Rating */}
              <h3 className="text-lg font-semibold">{trainer.userName}</h3>
              <p className="text-yellow-500">⭐ {trainer.ratings?.averageRating || "N/A"}/5</p>

              {/* Categories */}
              <p className="text-gray-600 text-sm">
                Expertise: {trainer.expertise?.join(", ") || "N/A"}
              </p>

              {/* View Details Button */}
              <Link
                to={`/TrainerDetails/${trainer.id}`}
                className="mt-3 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                View Coach Details
              </Link>
            </div>
          ))
        ) : (
          !loading && <p className="text-center text-gray-600 col-span-full">No trainers found.</p>
        )}
      </div>
    </div>
  );
};

export default TrainersList;
