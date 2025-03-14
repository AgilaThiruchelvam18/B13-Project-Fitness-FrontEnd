import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerProfile = () => {
  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    phone: "",
    fitnessGoal: "",
    age: "",
    gender: "",
    password: ""
  });

  const [editProfile, setEditProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [originalUser, setOriginalUser] = useState(null);
const[userId,setUserId]=useState(null)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "https://fitnesshub-5yf3.onrender.com/api/user-auth/profile",
          { withCredentials: true }
        );
        console.log("res.data",res.data)

        const userData = {
          id: res.data._id,
          username: res.data.userName,
          email: res.data.email,
          phone: res.data.phone || "",
          fitnessGoal: Array.isArray(res.data.fitnessGoals)
            ? res.data.fitnessGoals.join(", ")
            : res.data.fitnessGoals || "",
          age: res.data.age || "",
          gender: res.data.gender || "",
          password:  res.data.password
        };
console.log("userData",userData)
        setUser(userData);
        setUserId(userData.id)
        setOriginalUser(userData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setUser({ ...user, [e.target.name]: e.target.value });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(
        `https://fitnesshub-5yf3.onrender.com/api/users/${userId}`,
        {
          userName: user.username,
          phone: user.phone,
          fitnessGoals: Array.isArray(user.fitnessGoal)
            ? user.fitnessGoal
            : [user.fitnessGoal],
          age: user.age,
          gender: user.gender,
          password: user.password

        },
        { withCredentials: true }
      );
      
    //   if (user.currentPassword) {
    //     await axios.put(
    //       "https://fitnesshub-5yf3.onrender.com/api/users/change-password",
    //       {
    //         currentPassword: user.currentPassword,
    //       },
    //       { withCredentials: true }
    //     );
    //   }

      setMessage("Profile updated successfully!");
      setEditProfile(false);
      setOriginalUser(user);
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Update failed. Try again.");
    }
    setLoading(false);
  };

  const handleCancelEdit = () => {
    if (originalUser) {
      setUser(originalUser);
    }
    setEditProfile(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Customer Profile</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}

      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Profile Information</h3>
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Name"
          />
          <input type="email" value={user.email} className="w-full p-2 border rounded-md bg-gray-200" disabled />
          <input
            type="text"
            name="phone"
            value={user.phone}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Phone"
          />
          <input
            type="text"
            name="fitnessGoal"
            value={typeof user.fitnessGoal === "object" ? JSON.stringify(user.fitnessGoal) : user.fitnessGoal}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Fitness Goal"
          />
          <input
            type="number"
            name="age"
            value={user.age}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            disabled={!editProfile}
            placeholder="Age"
          />
          <select
            name="gender"
            value={user.gender}
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
            type="password"
            name="password"
            value={user.password}
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

export default CustomerProfile;
