import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/trainer/profile");
      setProfile(res.data);
    } catch (error) {
      console.error("Error fetching profile", error);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Profile</h2>
      <p>Name: {profile.name}</p>
      <p>Email: {profile.email}</p>
      <p>Expertise: {profile.expertise}</p>
    </div>
  );
};

export default Profile;
