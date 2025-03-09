import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const TrainerSignup = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    userName: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    phone: Yup.string().matches(/^\d{10}$/, "Phone number must be exactly 10 digits").required("Phone number is required"),
    expertise: Yup.array().min(1, "Select at least one expertise"),
    bio: Yup.string().required("Bio is required"),
    certifications: Yup.array(),
    availability: Yup.array().min(1, "Select availability"),
    coverMedia: Yup.mixed().nullable(),
    socialLinks: Yup.object({
      facebook: Yup.string().url("Invalid URL").nullable(),
      instagram: Yup.string().url("Invalid URL").nullable(),
      twitter: Yup.string().url("Invalid URL").nullable(),
      linkedin: Yup.string().url("Invalid URL").nullable(),
      youtube: Yup.string().url("Invalid URL").nullable(),
    }),
  });

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
            bio: "",
            certifications: [],
            // availability: [],
            coverMedia: null,
            // socialLinks: {
            //   facebook: "",
            //   instagram: "",
            //   twitter: "",
            //   linkedin: "",
            //   youtube: "",
            // },
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            console.log("Submitting Form Values:", values);

            try {
              const formData = new FormData();

              // ✅ Append data correctly
              Object.entries(values).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                  value.forEach((item) => formData.append(key, item));
                } else if (key === "coverMedia" && value) {
                  formData.append(key, value);
                } else if (typeof value === "object") {
                  formData.append(key, JSON.stringify(value));
                } else {
                  formData.append(key, value);
                }
              });

              console.log("FormData before submission:", Object.fromEntries(formData.entries()));

              // ✅ API Call
              const response = await axios.post(
                "https://fitnesshub-5yf3.onrender.com/api/trainer-auth/register",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );

              console.log("Response Data:", response.data);
              setMessage(response.data.message);
              setTimeout(() => navigate("/trainer/login"), 2000);
            } catch (error) {
              console.error("Error Response:", error.response?.data || error.message);
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
              <Field as="select" name="expertise" multiple className="border p-2 rounded mt-1">
                {["Yoga", "Strength Training", "Cardio", "Zumba", "Meditation", "Nutrition"].map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Field>
              <ErrorMessage name="expertise" component="div" className="text-red-500 text-sm" />

              <Field as="textarea" name="bio" placeholder="Short Bio" className="border p-2 rounded mt-1" />
              <ErrorMessage name="bio" component="div" className="text-red-500 text-sm" />

              {/* <label className="mt-2">Cover Media (Image/Video):</label>
              <input
                type="file"
                accept="image/*, video/*"
                onChange={(event) => setFieldValue("coverMedia", event.target.files[0])}
                className="border p-2 rounded mt-1"
              /> */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-4 py-2 rounded ${isSubmitting ? "bg-gray-400" : "bg-blue-500 text-white"}`}
              >
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
