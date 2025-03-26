import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const SignupForm = () => {
  const [message, setMessage] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    userName: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
    phone: Yup.string().matches(/^\d{10}$/, "Phone number must be 10 digits").required("Phone is required"),
    age: Yup.number().min(10, "Age must be at least 10").max(100, "Age must be under 100").required("Age is required"),
    gender: Yup.string().oneOf(["Male", "Female", "Other"], "Select a valid gender").required("Gender is required"),
    fitnessGoal: Yup.string(),
    // profilePicture: Yup.mixed().nullable(),
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}

        <Formik
          initialValues={{
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            age: "",
            gender: "",
            fitnessGoal: "",
            // profilePicture: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const formData = new FormData();
              Object.keys(values).forEach((key) => {
                formData.append(key, values[key]);
              });
              // if (profilePicture) {
              //   formData.append("profilePicture", profilePicture);
              // }

              const response = await axios.post(
                "https://fitnesshub-5yf3.onrender.com/api/user-auth/register",
                formData,
                { withCredentials: true }
              );

              setMessage(response.data.message);
              setTimeout(() => navigate("/customer/login"), 2000);
            } catch (error) {
              setMessage(error.response?.data?.message || "Registration failed");
            }
            setSubmitting(false);
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

              <Field type="number" name="age" placeholder="Age" className="border p-2 rounded mt-1" />
              <ErrorMessage name="age" component="div" className="text-red-500 text-sm" />

              <Field as="select" name="gender" className="border p-2 rounded mt-1">
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </Field>
              <ErrorMessage name="gender" component="div" className="text-red-500 text-sm" />

              <Field type="text" name="fitnessGoal" placeholder="Fitness Goal" className="border p-2 rounded mt-1" />
              <ErrorMessage name="fitnessGoal" component="div" className="text-red-500 text-sm" />

              {/* <input
                type="file"
                accept="image/*"
                onChange={(event) => setFieldValue("profilePicture", event.currentTarget.files[0])}
                className="border p-2 rounded mt-1"
              /> */}

              <button type="submit" disabled={isSubmitting} className="mt-4 bg-blue-500 text-white py-2 rounded">
                {isSubmitting ? "Registering..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>

        <p className="mt-4 text-center">
          Already have an account? <Link to="/customer/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
