import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const TrainerSignup = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    userName: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),
    phone: Yup.string().matches(/^\d{10}$/, "Phone number must be exactly 10 digits").required("Phone number is required"),
    expertise: Yup.array().min(1, "Select at least one expertise"),
    specialization: Yup.string(),
    experience: Yup.number().min(0, "Experience must be a positive number").required("Experience is required"),
    bio: Yup.string().required("Bio is required"),
    certifications: Yup.string(),
    mediaUploads: Yup.mixed(),
  });

  const expertiseOptions = ["Yoga", "Strength Training", "Cardio", "Zumba", "Meditation", "Nutrition"];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
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
            specialization: "",
            experience: "",
            bio: "",
            certifications: "",
            mediaUploads: [],
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              Object.entries(values).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                  value.forEach((item) => formData.append(`${key}[]`, item));
                } else {
                  formData.append(key, value);
                }
              });

              const response = await axios.post(
                "https://fitnesshub-5yf3.onrender.com/api/trainer-auth/register",
                formData,
                { withCredentials: true, headers: { "Content-Type": "multipart/form-data" } }
              );

              setMessage(response.data.message);
              setTimeout(() => navigate("/trainer/login"), 2000);
            } catch (error) {
              setMessage(error.response?.data?.message || "Registration failed");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="flex flex-col">
              <Field type="text" name="userName" placeholder="Username" className="border p-2 rounded mt-1" />
              <ErrorMessage name="userName" component="div" className="text-red-500 text-sm" />

              <Field type="email" name="email" placeholder="Email" className="border p-2 rounded mt-1" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

              <Field type="password" name="password" placeholder="Password" className="border p-2 rounded mt-1" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

              <Field type="password" name="confirmPassword" placeholder="Confirm Password" className="border p-2 rounded mt-1" />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />

              <Field type="text" name="phone" placeholder="Phone Number" className="border p-2 rounded mt-1" />
              <ErrorMessage name="phone" component="div" className="text-red-500 text-sm" />

              <label className="mt-2">Expertise:</label>
              <div className="grid grid-cols-2 gap-2">
                {expertiseOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <Field type="checkbox" name="expertise" value={option} className="mr-2" />
                    {option}
                  </label>
                ))}
              </div>
              <ErrorMessage name="expertise" component="div" className="text-red-500 text-sm" />

              <Field type="text" name="specialization" placeholder="Specialization" className="border p-2 rounded mt-1" />
              <ErrorMessage name="specialization" component="div" className="text-red-500 text-sm" />

              <Field type="text" name="certifications" placeholder="Certifications" className="border p-2 rounded mt-1" />
              <ErrorMessage name="certifications" component="div" className="text-red-500 text-sm" />

              <Field type="number" name="experience" placeholder="Years of Experience" className="border p-2 rounded mt-1" />
              <ErrorMessage name="experience" component="div" className="text-red-500 text-sm" />

              <Field as="textarea" name="bio" placeholder="Short Bio" className="border p-2 rounded mt-1" />
              <ErrorMessage name="bio" component="div" className="text-red-500 text-sm" />

              <label className="mt-2">Upload Photos/Videos:</label>
              <input
                type="file"
                accept="image/*, video/*"
                multiple
                onChange={(event) => setFieldValue("mediaUploads", Array.from(event.target.files))}
                className="border p-2 rounded mt-1"
              />
              <ErrorMessage name="mediaUploads" component="div" className="text-red-500 text-sm" />

              <button type="submit" disabled={isSubmitting} className={`mt-4 py-2 rounded ${isSubmitting ? "bg-gray-400" : "bg-blue-500 text-white"}`}>
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

export default TrainerSignup;