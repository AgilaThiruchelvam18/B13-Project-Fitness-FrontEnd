import { useState } from "react";
import axios from "axios";

const TrainerSignup = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    expertise: "",
    phone: "",
    bio: "",
    certifications: "",
    availability: [{ day: "", timeSlots: [""] }],
    coverMedia: null,
    coverMediaType: "image",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: "",
      youtube: "",
    },
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("socialLinks.")) {
      setFormData((prevData) => ({
        ...prevData,
        socialLinks: {
          ...prevData.socialLinks,
          [name.split(".")[1]]: value,
        },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAvailabilityChange = (index, field, value) => {
    const newAvailability = [...formData.availability];
    if (field === "timeSlots") {
      newAvailability[index].timeSlots = value.split(",");
    } else {
      newAvailability[index][field] = value;
    }
    setFormData({ ...formData, availability: newAvailability });
  };

  const addAvailability = () => {
    setFormData({
      ...formData,
      availability: [...formData.availability, { day: "", timeSlots: [""] }],
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, coverMedia: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "coverMedia" && formData.coverMedia) {
        formDataToSend.append("coverMedia", formData.coverMedia);
      } else if (key === "availability") {
        formDataToSend.append("availability", JSON.stringify(formData.availability));
      } else if (key === "socialLinks") {
        formDataToSend.append("socialLinks", JSON.stringify(formData.socialLinks));
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const res = await axios.post(
        "https://fitnesshub-5yf3.onrender.com/api/authtrainer/register",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setSuccess("Trainer registered successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Error registering trainer");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Trainer Signup</h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-500 text-center">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <input type="text" name="userName" placeholder="Full Name" value={formData.userName} onChange={handleChange} className="input-field" required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="input-field" required />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} className="input-field" required />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} className="input-field" />
        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleChange} className="input-field"></textarea>

        {/* Expertise */}
        <input type="text" name="expertise" placeholder="Expertise (comma separated)" value={formData.expertise} onChange={handleChange} className="input-field" />

        {/* Certifications */}
        <input type="text" name="certifications" placeholder="Certifications (comma separated)" value={formData.certifications} onChange={handleChange} className="input-field" />

        {/* Availability */}
        <div>
          <label className="block font-medium">Availability:</label>
          {formData.availability.map((slot, index) => (
            <div key={index} className="flex gap-2">
              <input type="text" placeholder="Day" value={slot.day} onChange={(e) => handleAvailabilityChange(index, "day", e.target.value)} className="input-field w-1/2" />
              <input type="text" placeholder="Time Slots (comma separated)" value={slot.timeSlots.join(",")} onChange={(e) => handleAvailabilityChange(index, "timeSlots", e.target.value)} className="input-field w-1/2" />
            </div>
          ))}
          <button type="button" onClick={addAvailability} className="text-blue-500 text-sm">+ Add More</button>
        </div>

        {/* Cover Media Upload */}
        <label className="block font-medium">Profile Cover:</label>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="input-field" />

        {/* Social Links */}
        <div>
          <label className="block font-medium">Social Links:</label>
          <input type="url" name="socialLinks.facebook" placeholder="Facebook URL" value={formData.socialLinks.facebook} onChange={handleChange} className="input-field" />
          <input type="url" name="socialLinks.instagram" placeholder="Instagram URL" value={formData.socialLinks.instagram} onChange={handleChange} className="input-field" />
          <input type="url" name="socialLinks.twitter" placeholder="Twitter URL" value={formData.socialLinks.twitter} onChange={handleChange} className="input-field" />
          <input type="url" name="socialLinks.linkedin" placeholder="LinkedIn URL" value={formData.socialLinks.linkedin} onChange={handleChange} className="input-field" />
          <input type="url" name="socialLinks.youtube" placeholder="YouTube URL" value={formData.socialLinks.youtube} onChange={handleChange} className="input-field" />
        </div>

        {/* Submit */}
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full hover:bg-blue-600">Register</button>
      </form>
    </div>
  );
};

export default TrainerSignup;
