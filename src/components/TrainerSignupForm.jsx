import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const TrainerSignupForm = () => {
  const [message, setMessage] = useState("");
  const [coverMedia, setCoverMedia] = useState(null);
  const [coverMediaType, setCoverMediaType] = useState("image");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    userName: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    phone: Yup.string().min(10, "Phone number must be 10 digits").max(10, "Phone number must be 10 digits"),
    expertise: Yup.array().min(1, "At least one expertise is required"),
    bio: Yup.string(),
    certifications: Yup.array(),
    availability: Yup.array(),
    facebook: Yup.string().url("Invalid URL"),
    instagram: Yup.string().url("Invalid URL"),
    twitter: Yup.string().url("Invalid URL"),
    linkedin: Yup.string().url("Invalid URL"),
    youtube: Yup.string().url("Invalid URL"),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Trainer Sign Up</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}
        <Formik
          initialValues={{
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            expertise: [],
            bio: "",
            certifications: [],
            availability: [],
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
            youtube: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              Object.keys(values).forEach((key) => {
                if (Array.isArray(values[key])) {
                  values[key].forEach((item) => formData.append(key, item));
                } else {
                  formData.append(key, values[key]);
                }
              });

              // Append cover media
              if (coverMedia) {
                formData.append("coverMedia", coverMedia);
                formData.append("coverMediaType", coverMediaType);
              }

              // Default ratings (will be updated later by reviews)
              formData.append("averageRating", 0);
              formData.append("totalReviews", 0);

              const response = await axios.post(
                "https://fitnesshub-5yf3.onrender.com/api/trainer-auth/register",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );

              setMessage(response.data.message);
              setTimeout(() => navigate("/trainer/login"), 2000);
            } catch (error) {
              setMessage(error.response?.data?.message || "Registration failed");
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col">
              <Field type="text" name="userName" placeholder="Username" className="border p-2 rounded mt-1" />
              <ErrorMessage name="userName" component="div" className="text-red-500 text-sm" />

              <Field type="email" name="email" placeholder="Email" className="border p-2 rounded mt-1" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

              <Field type="password" name="password" placeholder="Password" className="border p-2 rounded mt-1" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

              <Field type="password" name="confirmPassword" placeholder="Confirm Password" className="border p-2 rounded mt-1" />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />

              <label className="mt-2">Cover Media (Image/Video)</label>
              <input type="file" accept="image/*,video/*" onChange={(event) => setCoverMedia(event.target.files[0])} className="border p-2 rounded mt-1" />
              <select onChange={(e) => setCoverMediaType(e.target.value)} className="border p-2 rounded mt-1">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>

              <button type="submit" disabled={isSubmitting} className="mt-4 bg-blue-500 text-white py-2 rounded">
                {isSubmitting ? "Registering..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/trainer/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default TrainerSignupForm;
