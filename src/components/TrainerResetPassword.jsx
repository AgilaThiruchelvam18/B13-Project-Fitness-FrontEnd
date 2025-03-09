import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const TrainerResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Trainer Reset Password</h2>
        {message && <p className="text-red-500 text-center">{message}</p>}
        
        <Formik
          initialValues={{ password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post(
                `https://fitnesshub-5yf3.onrender.com/api/trainer-auth/reset-password/${token}`,
                values,
                { withCredentials: true }
              );
              setMessage(response.data.message);
              setTimeout(() => navigate("/trainer/login"), 2000);
            } catch (error) {
              setMessage(error.response?.data?.message || "Reset failed");
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col">
              <Field
                type="password"
                name="password"
                placeholder="Enter new password"
                className="border p-2 rounded mt-1"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 bg-blue-500 text-white py-2 rounded"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TrainerResetPassword;
