import React, { useEffect, useState } from "react";
import axios from "axios";

const TrainerProfile = () => {
  const [trainer, setTrainer] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
    expertise: [],
    certifications: "",
    specialization: "",
    experience: "",
    bio: "",
    ratings: { averageRating: "", totalReviews: "" },
    reviews: [],
    mediaUploads: [],
    classes: [],
    coverPhoto: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://fitnesshub-5yf3.onrender.com/api/trainer-auth/profile",
          { withCredentials: true }
        );
        if (res.data) {
          setTrainer({
            id: res.data._id,
            username: res.data.userName || "",
            email: res.data.email || "",
            phone: res.data.phone || "",
            expertise: res.data.expertise || [],
            certifications: res.data.certifications || "",
            specialization: res.data.specialization || "",
            experience: res.data.experience || "",
            bio: res.data.bio || "",
            ratings: res.data.ratings || { averageRating: 0, totalReviews: 0 },
            reviews: res.data.reviews || [],
            mediaUploads: res.data.mediaUploads || [],
            classes: res.data.classes || [],
            coverPhoto: res.data.coverPhoto || "",
            profilePicture: res.data.profilePicture || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-gray-100 p-4 gap-6">
      <div className="w-full flex gap-6">
        {/* Left Side - Profile Info & Reviews */}
        <div className="w-2/3 bg-white shadow-lg rounded-lg flex flex-col p-6">
          {/* Trainer Info */}
          <div className="flex items-center gap-6">
            {trainer.mediaUploads && trainer.mediaUploads.length > 0 ? (
    <img
      src={trainer.mediaUploads[0].url} // Show the first uploaded image
      alt="Trainer Media"
      className="w-24 h-24 rounded-full object-cover"
    />
  ) : (
              <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-full">
                <span className="text-gray-600">No Image</span>
              </div>
            )}
            <div>
              <h2 className="text-2xl font-semibold">{trainer.username}</h2>
              <p className="text-gray-600">{trainer.email}</p>
              <p className="text-gray-600">📞 {trainer.phone}</p>
            </div>
          </div>

          {/* Experience, Ratings, Bio */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Experience</h3>
              <p className="text-gray-700">{trainer.experience} years</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Ratings</h3>
              <p className="text-yellow-500 text-lg">
                ⭐ {trainer.ratings?.averageRating || "0"} (
                {trainer.ratings?.totalReviews} reviews)
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Bio</h3>
              <p className="text-gray-700">{trainer.bio || "N/A"}</p>
            </div>
          </div>

          {/* Expertise, Certifications, Specialization */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-semibold">Expertise</h3>
              <p className="text-gray-700">
                {trainer.expertise?.join(", ") || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Certifications</h3>
              <p className="text-gray-700">{trainer.certifications || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Specialization</h3>
              <p className="text-gray-700">{trainer.specialization || "N/A"}</p>
            </div>
          </div>

          {/* User Reviews - Grid Layout */}
          <div className="mt-4 flex-grow overflow-y-auto border-t pt-4">
            <h3 className="text-xl font-semibold mb-2">User Reviews</h3>
            <div className="grid grid-cols-2 gap-4">
              {trainer.reviews.length > 0 ? (
                trainer.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-md bg-gray-50 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{review.user.userName}</p>
                      <p className="text-yellow-500">⭐ {review.rating || "N/A"}</p>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Created Events */}
        <div className="w-1/3 bg-white shadow-lg rounded-lg p-6 overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Created Events</h3>
          {trainer.classes.length > 0 ? (
            trainer.classes.map((event, index) => (
              <div
                key={index}
                className="p-4 border rounded-md bg-gray-50 mb-4"
              >
                <div className="flex flex-row justify-between">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-gray-600">{event.category}</p>
                </div>
                <div className="flex flex-row">
                  <p className="text-gray-600 m-4">👥 {event.capacity}</p>
                  <p className="text-gray-600 m-4">⏳ {event.duration}</p>
                  <p className="text-gray-600 m-4">💰{event.price}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No events created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;
