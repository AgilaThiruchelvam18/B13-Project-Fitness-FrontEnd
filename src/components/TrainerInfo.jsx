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
    password: "",
    expertise: "",
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
          "https://fitnessbookingapi.onrender.com/api/trainer-auth/profile",
          { withCredentials: true }
        );

        console.log("res.data", res.data);

        const userData = {
          id: res.data._id,
          username: res.data.userName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          fitnessGoal: res.data.fitnessGoal || "",
          age: res.data.age || "",
          gender: res.data.gender || "",
          password: res.data.password || "",
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

    try {
      await axios.put(
        `https://fitnessbookingapi.onrender.com/api/trainers/${trainerId}`,
        {
          userName: trainer.username,
          phone: trainer.phone,
          fitnessGoal: trainer.fitnessGoal,
          age: trainer.age,
          gender: trainer.gender,
          expertise: trainer.expertise,
          specialization: trainer.specialization,
          experience: trainer.experience,
          bio: trainer.bio,
          certifications: trainer.certifications.split(",").map((cert) => cert.trim()),
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
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Trainer Profile</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <input
            type="text"
            name="username"
            value={trainer.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Name"
          />
          <input type="email" value={trainer.email} className="w-full p-2 border rounded-md bg-gray-200" disabled />
          <input
            type="text"
            name="phone"
            value={trainer.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Phone"
          />
          <input
            type="text"
            name="fitnessGoal"
            value={trainer.fitnessGoal}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Fitness Goal"
          />
          <input
            type="number"
            name="age"
            value={trainer.age}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Age"
          />
          <select
            name="gender"
            value={trainer.gender}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <input
            type="text"
            name="expertise"
            value={trainer.expertise}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Expertise"
          />
          <input
            type="text"
            name="specialization"
            value={trainer.specialization}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Specialization"
          />
          <input
            type="text"
            name="experience"
            value={trainer.experience}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Experience"
          />
          <textarea
            name="bio"
            value={trainer.bio}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Bio"
          />
          <input
            type="text"
            name="certifications"
            value={trainer.certifications}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Certifications (comma-separated)"
          />
          <input
            type="password"
            name="password"
            value={trainer.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="**********"
          />
          {editProfile ? (
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
                {loading ? "Updating..." : "Save Changes"}
              </button>
              <button type="button" onClick={handleCancelEdit} className="flex-1 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600">
                Cancel
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setEditProfile(true)} className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600">
              Edit Profile
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default TrainerProfile;
