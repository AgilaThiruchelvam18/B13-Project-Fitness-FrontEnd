import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TrainerRequestResetPassword = () => {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

        {message && <p className="text-green-500 text-center">{message}</p>}

        <Formik
          initialValues={{ email: "" }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email("Invalid email address")
              .required("Email is required"),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await axios.post(
                "https://fitnesshub-5yf3.onrender.com/api/trainer-auth/request-password-reset",
                values
              );
              setMessage("Check your email for reset link.");
              setSubmitting(false); // Stop loading after success
            } catch (error) {
              setMessage("Failed to send reset link.");
              setSubmitting(false); // Stop loading on error
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col">
              <Field
                type="email"
                name="email"
                placeholder="Enter email"
                className="border p-2 w-full rounded-md"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-sm"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white py-2 w-full ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TrainerRequestResetPassword;
