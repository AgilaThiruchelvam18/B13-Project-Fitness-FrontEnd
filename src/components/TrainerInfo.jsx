import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainerProfile = () => {
  const [trainer, setTrainer] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
    fitnessGoal: "",
    age: "",
    gender: "",
    expertise: [],
    certifications: "",
    specialization: "",
    experience: "",
    bio: "",
    ratings: { averageRating: 0, totalReviews: 0 },
    reviews: [],
    mediaUploads: [],
  });

  const [trainerId, setTrainerId] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [originalTrainer, setOriginalTrainer] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://fitnesshub-5yf3.onrender.com/api/trainer-auth/profile",
          { withCredentials: true }
        )
        if (res.data) {
          const userData = {
            id: res.data._id,
            username: res.data.userName || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            certifications: res.data.certifications || "",
            specialization: res.data.specialization || "",
            experience: res.data.experience || "",
            bio: res.data.bio || "",
            expertise: Array.isArray(res.data.expertise)
            ? res.data.expertise.join(", ") 
            : res.data.expertise || "",
            ratings: res.data.ratings || { averageRating: 0, totalReviews: 0 },
            reviews: res.data.reviews || [],
            mediaUploads: res.data.mediaUploads || [],
          };
          setTrainerId(userData.id);
          setTrainer(userData);
          setOriginalTrainer(userData);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => setTrainer({ ...trainer, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await axios.put(
        `https://fitnesshub-5yf3.onrender.com/api/trainers/${trainerId}`,
        {
          userName: trainer.username,
          phone: trainer.phone,
         
          expertise:  trainer.expertise.split(",").map((exp) => exp.trim()),
          specialization: trainer.specialization,
          experience: trainer.experience,
          bio: trainer.bio,
          certifications: trainer.certifications,
          ratings: trainer.ratings,
          reviews: trainer.reviews,
          mediaUploads: trainer.mediaUploads,
        },
        { withCredentials: true }
      );

      setMessage("Profile updated successfully!");
      setEditProfile(false);
      setOriginalTrainer(trainer);
    } catch (error) {
      console.error("Failed to update profile:", error);
      setMessage("Failed to update profile. Please try again.");
    }

    setLoading(false);
  };

  const handleCancelEdit = () => {
    if (originalTrainer) {
      setTrainer(originalTrainer);
    }
    setEditProfile(false);
  };

  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      {/* Background Cover Photo/Video */}
      <div className="relative w-full h-64">
        <img
          src={trainer.coverPhoto || "https://via.placeholder.com/1500x500"}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">{trainer.username}</h1>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-[-4rem] relative z-10">
        <div className="flex items-center gap-6">
          <img
            src={trainer.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover"
          />
          <div>
            <h2 className="text-2xl font-semibold">{trainer.username}</h2>
            <p className="text-gray-600">{trainer.email}</p>
            <p className="text-gray-600">📞 {trainer.phone}</p>
          </div>
        </div>

        {/* Expertise, Certifications, Specialization */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-2">Expertise</h3>
            <p className="text-gray-700">{trainer.expertise?.join(", ") || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Certifications</h3>
            <p className="text-gray-700">{trainer.certifications || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Specialization</h3>
            <p className="text-gray-700">{trainer.specialization || "N/A"}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Experience</h3>
            <p className="text-gray-700">{trainer.experience} years</p>
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Bio</h3>
          <p className="text-gray-700">{trainer.bio || "N/A"}</p>
        </div>

        {/* Ratings and Reviews */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Ratings & Reviews</h3>
          <div className="flex items-center gap-2 text-yellow-500 text-lg">
            <span>{trainer.ratings?.averageRating || "0"}</span>
            <span>⭐</span>
            <span>({trainer.ratings?.totalReviews} reviews)</span>
          </div>
        </div>

        {/* User Reviews */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">User Reviews</h3>
          <div className="space-y-4">
            {trainer.reviews.length > 0 ? (
              trainer.reviews.map((review, index) => (
                <div key={index} className="p-4 border rounded-md bg-gray-50">
                  <p className="font-semibold">{review.user}</p>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No reviews yet.</p>
            )}
          </div>
        </div>

        {/* Created Events */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Created Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trainer.classes?.length > 0 ? (
              trainer.classes.map((event, index) => (
                <div key={index} className="p-4 border rounded-md bg-gray-50">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-gray-600">{event.date}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No events created yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
