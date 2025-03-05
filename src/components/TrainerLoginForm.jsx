import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const TrainerLoginForm = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Trainer Login</h2>
        {message && <p className="text-red-500 text-center">{message}</p>}
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post(
                "https://fitnesshub-5yf3.onrender.com/api/trainer-auth/login",
                values
              );
              localStorage.setItem("trainerToken", response.data.token);
              navigate("/trainer/dashboard");
            } catch (error) {
              setMessage(error.response?.data?.message || "Login failed");
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col">
              <Field type="email" name="email" placeholder="Email" className="border p-2 rounded mt-1" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

              <Field type="password" name="password" placeholder="Password" className="border p-2 rounded mt-1" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

              <button type="submit" disabled={isSubmitting} className="mt-4 bg-blue-500 text-white py-2 rounded">
                {isSubmitting ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center">
          Forgot your password? <Link to="/trainer/forgot-password" className="text-blue-500">Reset here</Link>
        </p>
        <p className="mt-4 text-center">
          Want to register? <Link to="/trainer/signup" className="text-blue-500">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default TrainerLoginForm;
