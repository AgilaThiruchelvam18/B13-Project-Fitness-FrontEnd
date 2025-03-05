// import { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";

// const SignupForm = () => {
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const validationSchema = Yup.object({
//     userName: Yup.string().required("Username is required"),
//     email: Yup.string().email("Invalid email").required("Email is required"),
//     password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
//     confirmPassword: Yup.string()
//       .oneOf([Yup.ref("password"), null], "Passwords must match")
//       .required("Confirm password is required"),
//     fitnessGoals: Yup.string(), // ✅ Optional field
//     profilePicture: Yup.mixed().nullable(), // ✅ Profile picture is optional now
//   });

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//         <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
//         {message && <p className="text-red-500 text-center">{message}</p>}

//         <Formik
//           initialValues={{
//             userName: "",
//             email: "",
//             password: "",
//             confirmPassword: "",
//             fitnessGoals: "",
//             profilePicture: "",
//           }}
//           validationSchema={validationSchema}
//           onSubmit={async (values, { setSubmitting }) => {
//             console.log("Submitting values:", values); // ✅ Debugging
            
//             try {
//               const formData = new FormData();
//               formData.append("userName", values.userName);
//               formData.append("email", values.email);
//               formData.append("password", values.password);
//               formData.append("fitnessGoals", values.fitnessGoals || ""); // ✅ Avoid undefined
          
//               if (values.profilePicture) {
//                 formData.append("profilePicture", values.profilePicture);
//               }
          
//               console.log("FormData before sending:", Object.fromEntries(formData.entries())); // ✅ Debugging
          
//               const response = await axios.post("https://fitnesshub-5yf3.onrender.com/api/user-auth/register", formData
//               // , {
//                 // headers: { "Content-Type": "multipart/form-data" }
//               // }
//             )
          
//               setMessage(response.data.message);
//               setTimeout(() => navigate("/customer/login"), 2000);
//             } catch (error) {
//               console.error("Signup Error:", error.response?.data || error.message);
//               setMessage(error.response?.data?.message || "Registration failed");
//             }
//             finally {
//               setSubmitting(false); // ✅ Ensure button resets
//             }
//           }}
          
//         >
//           {({ isSubmitting, setFieldValue }) => (
//             <Form className="flex flex-col">
//               {/* Username */}
//               <Field type="text" name="userName" placeholder="Username" className="border p-2 rounded mt-1" />
//               <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />

//               {/* Email */}
//               <Field type="email" name="email" placeholder="Email" className="border p-2 rounded mt-1" />
//               <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />

//               {/* Password */}
//               <Field type="password" name="password" placeholder="Password" className="border p-2 rounded mt-1" />
//               <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />

//               {/* Confirm Password */}
//               {/* <Field type="password" name="confirmPassword" placeholder="Confirm Password" className="border p-2 rounded mt-1" />
//               <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" /> */}

//               {/* Fitness Goals (Optional) */}
//               {/* <Field type="text" name="fitnessGoals" placeholder="Fitness Goals" className="border p-2 rounded mt-1" />
//               <ErrorMessage name="fitnessGoals" component="div" className="text-red-500 text-sm" />*/}

//               {/* Profile Picture Upload (Optional) */}
//               {/* <input
//                 type="file"
//                 accept="image/*"
//                 onChange={(event) => setFieldValue("profilePicture", event.currentTarget.files[0])}
//                 className="border p-2 rounded mt-1"
//               />  */}

//               {/* Submit Button */}
//               <button type="submit" disabled={isSubmitting} className="mt-4 bg-blue-500 text-white py-2 rounded">
//                 {isSubmitting ? "Registering..." : "Sign Up"}
//               </button>
//             </Form>
//           )}
//         </Formik>

//         {/* Redirect to Login */}
//         <p className="mt-4 text-center">
//           Already have an account? <Link to="/customer/login" className="text-blue-500">Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SignupForm;


import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router";

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
  fitnessGoals: Yup.string(), // ✅ Optional field
  profilePicture: Yup.mixed().nullable(), // ✅ Profile picture is optional now
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>
        {message && <p className="text-green-500 text-center">{message}</p>}
        <Formik
          initialValues={{ userName: "", email: "", password: "",   confirmPassword: "",
            fitnessGoals: "",
            profilePicture: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await axios.post("https://fitnesshub-5yf3.onrender.com/api/user-auth/register",
                values
              );
              setMessage(response.data.message);
              setTimeout(() => navigate("/customer/login"), 2000);
            } catch (error) {
              setMessage(error.response?.data?.message || "Registration failed");
            }
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col">
              <Field type="text" name="userName" placeholder="userName" className="border p-2 rounded mt-1" />
              <ErrorMessage name="userName" component="div" className="text-red-500 text-sm" />
              
              <Field type="email" name="email" placeholder="Email" className="border p-2 rounded mt-1" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              
              <Field type="password" name="password" placeholder="Password" className="border p-2 rounded mt-1" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            
              <Field type="password" name="confirmPassword" placeholder="Confirm Password" className="border p-2 rounded mt-1" />
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" /> 

          
              <Field type="text" name="fitnessGoals" placeholder="Fitness Goals" className="border p-2 rounded mt-1" />
              <ErrorMessage name="fitnessGoals" component="div" className="text-red-500 text-sm" />

             
              <input
  type="file"
  accept="image/*"
  onChange={(event) => setProfilePicture(event.target.files[0])}
  className="border p-2 rounded mt-1"
/>
              <button type="submit" disabled={isSubmitting} className="mt-4 bg-blue-500 text-white py-2 rounded">
                {isSubmitting ? "Registering..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center">
          Already have an account? <Link to="/login" className="text-blue-500">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;

