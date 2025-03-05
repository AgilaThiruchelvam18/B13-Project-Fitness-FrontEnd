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
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    expertise: Yup.array().min(1, "At least one expertise is required"),
    availability: Yup.array().min(1, "At least one availability slot is required"),
    bio: Yup.string().max(500, "Bio cannot exceed 500 characters"),
    facebook: Yup.string().url("Invalid URL").nullable(),
    instagram: Yup.string().url("Invalid URL").nullable(),
    twitter: Yup.string().url("Invalid URL").nullable(),
    linkedin: Yup.string().url("Invalid URL").nullable(),
    youtube: Yup.string().url("Invalid URL").nullable(),
    coverMedia: Yup.mixed().required("Cover media is required"),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Trainer Signup</h2>
        {message && <p className="text-red-500 text-center">{message}</p>}

        <Formik
          initialValues={{
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            expertise: [],
            availability: [],
            bio: "",
            facebook: "",
            instagram: "",
            twitter: "",
            linkedin: "",
            youtube: "",
            coverMedia: null,
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const formData = new FormData();
            Object.keys(values).forEach((key) => {
              if (key === "coverMedia" && values.coverMedia) {
                formData.append("coverMedia", values.coverMedia);
              } else if (Array.isArray(values[key])) {
                formData.append(key, JSON.stringify(values[key]));
              } else {
                formData.append(key, values[key]);
              }
            });

            try {
              await axios.post("https://fitnesshub-5yf3.onrender.com/api/trainer-auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
              });
              setMessage("Signup successful! Redirecting...");
              setTimeout(() => navigate("/trainer/login"), 2000);
            } catch (error) {
              setMessage(error.response?.data?.message || "Signup failed");
            }
            setSubmitting(false);
          }}
        >
          {({ setFieldValue, isSubmitting }) => (
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

              <Field type="text" name="bio" placeholder="Short Bio" className="border p-2 rounded mt-1" />
              <ErrorMessage name="bio" component="div" className="text-red-500 text-sm" />

              <label className="mt-2">Expertise:</label>
              <Field as="select" name="expertise" multiple className="border p-2 rounded mt-1">
                <option value="yoga">Yoga</option>
                <option value="strength">Strength Training</option>
                <option value="cardio">Cardio</option>
                <option value="pilates">Pilates</option>
              </Field>
              <ErrorMessage name="expertise" component="div" className="text-red-500 text-sm" />

              <label className="mt-2">Availability:</label>
              <Field as="select" name="availability" multiple className="border p-2 rounded mt-1">
                <option value="morning">Morning</option>
                <option value="afternoon">Afternoon</option>
                <option value="evening">Evening</option>
              </Field>
              <ErrorMessage name="availability" component="div" className="text-red-500 text-sm" />

              <label className="mt-2">Social Links:</label>
              <Field type="text" name="facebook" placeholder="Facebook URL" className="border p-2 rounded mt-1" />
              <ErrorMessage name="facebook" component="div" className="text-red-500 text-sm" />

              <Field type="text" name="instagram" placeholder="Instagram URL" className="border p-2 rounded mt-1" />
              <ErrorMessage name="instagram" component="div" className="text-red-500 text-sm" />

              <Field type="text" name="twitter" placeholder="Twitter URL" className="border p-2 rounded mt-1" />
              <ErrorMessage name="twitter" component="div" className="text-red-500 text-sm" />

              <Field type="text" name="linkedin" placeholder="LinkedIn URL" className="border p-2 rounded mt-1" />
              <ErrorMessage name="linkedin" component="div" className="text-red-500 text-sm" />

              <Field type="text" name="youtube" placeholder="YouTube URL" className="border p-2 rounded mt-1" />
              <ErrorMessage name="youtube" component="div" className="text-red-500 text-sm" />

              <label className="mt-2">Upload Cover Media:</label>
              <input type="file" accept="image/*,video/*" className="border p-2 rounded mt-1"
                onChange={(event) => setFieldValue("coverMedia", event.currentTarget.files[0])} />
              <ErrorMessage name="coverMedia" component="div" className="text-red-500 text-sm" />

              <button type="submit" disabled={isSubmitting} className="mt-4 bg-blue-500 text-white py-2 rounded">
                {isSubmitting ? "Signing up..." : "Sign Up"}
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
