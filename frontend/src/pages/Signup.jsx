import React, { useState } from "react";
import axios from 'axios';
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

const initialValuesRegister = {
  username: "",
  name: "",
  password: "",
  confirm_password: "",
};

// Initial values of login form
const initialValuesLogin = {
  username: "",
  password: "",
};

const loginSchema = yup.object().shape({
  username: yup.string().required("Required !"),
  password: yup.string().required("Required !"),
});

const Signup = () => {
  const navigate = useNavigate();

  const [pageType, setPageType] = useState("login");
  const [visible, setVisible] = useState(false);

  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const initialValues = isLogin ? initialValuesLogin : initialValuesRegister;

  // Function to store encrypted data in localStorage
  const storeData = (key, data) => {
    localStorage.setItem(key, data);
  };

  // Formik form handling
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (isRegister) {
          await handleFormResSubmit(values);
        } else {
          await handleFormSubmit(values);
        }
        resetForm();
      } catch (error) {
        console.error('Error during form submission:', error);
      }
    },

    validate: isRegister
      ? async (values) => {
          // Password validation regex
          const passwordregex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/;
          let errors = {};

          // Username validation
          if (!values.username) {
            errors.username = "Required !";
          }

          // Name validation
          if (!values.name) {
            errors.name = "Required !";
          }

          // Password validation
          if (!values.password) {
            errors.password = "Required !";
          } else if (values.password.length < 8) {
            errors.password = "Password must be at least 8 letters long";
          } else if (!passwordregex.test(values.password)) {
            errors.password =
              "Password must contain at least a capital letter, a special character, and a number";
          }

          // Confirm password validation
          if (!values.confirm_password) {
            errors.confirm_password = "Required !";
          }
          if (values.password !== values.confirm_password) {
            errors.confirm_password = "Passwords must match";
          }

          return errors;
        }
      : undefined,
    validationSchema: isLogin ? loginSchema : undefined,
  });

  // Login handling
  const handleFormSubmit = async (values) => {
    try {
      const result = await axios.post("https://go-date-api.vercel.app/login", values);
      const myId = result.data._id;
      storeData('appId', myId);
      navigate("/Create");
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Registration handling
  const handleFormResSubmit = async (values) => {
    try {
      await axios.post("https://go-date-api.vercel.app/register", values);
      setPageType("login");
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center">
        <form onSubmit={formik.handleSubmit} className="max-w-sm w-full bg-yellow-300 p-5 rounded-lg gap-3 flex items-start flex-col">
          <div>
            {isRegister ? (
              <div className="flex items-start flex-col">
                <p className="text-3xl font-bold">Register</p>
                <p className="text-gray-400">Seems like a new user</p>
              </div>
            ) : (
              <div className="flex items-start flex-col">
                <p className="text-3xl font-bold">Sign in</p>
                <p className="text-gray-400">Seems like you're an existing user</p>
              </div>
            )}
          </div>

          <label htmlFor="username">Username</label>
          <input
            type="text"
            className="w-full rounded-xl p-2"
            name="username"
            placeholder="Enter your username"
            id="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <p className="text-red-600 mt-[-8px]">{formik.errors.username}</p>
          ) : null}

          {isRegister && (
            <>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                className="w-full rounded-xl p-2"
                name="name"
                placeholder="Enter your name"
                id="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name ? (
                <p className="text-red-600 mt-[-8px]">{formik.errors.name}</p>
              ) : null}
            </>
          )}

          <label htmlFor="password">Password</label>
          <div className="w-full relative mb-2">
            <input
              type={visible ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-xl p-2"
              id="password"
              name="password"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <span
              className="absolute top-0.5 cursor-pointer right-1"
              onClick={() => setVisible(!visible)}
            >
              {!visible ? (
                <button className="bg-black w-3"></button>
              ) : (
                <button className="bg-red-800 w-3"></button>
              )}
            </span>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <p className="text-red-600 mt-[-8px]">{formik.errors.password}</p>
          ) : null}

          {isRegister && (
            <>
              <div className="flex w-full items-start gap-3 flex-col">
                <label className="label" htmlFor="confirm_password">
                  Confirm Password
                </label>
                <input
                  type={visible ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="input_field w-full rounded-xl p-2"
                  id="confirm_password"
                  name="confirm_password"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  value={formik.values.confirm_password}
                />
              </div>
              {formik.touched.confirm_password && formik.errors.confirm_password ? (
                <p className="text-red-600">{formik.errors.confirm_password}</p>
              ) : null}
            </>
          )}

          {isRegister ? (
            <button
              type="submit"
              className="auth-btn rounded-lg font-semibold bg-black text-white px-6 py-2"
            >
              Sign Up
            </button>
          ) : (
            <button
              type="submit"
              className="auth-btn rounded-lg bg-black font-semibold text-white px-6 py-2"
            >
              Sign in
            </button>
          )}

          <p
            onClick={() => {
              setPageType(isLogin ? "register" : "login");
              formik.resetForm();
            }}
            className="underline hover:cursor-pointer text-blue-500 mt-3"
          >
            {isLogin
              ? "Don't have an account? Sign Up here."
              : "Already have an account? Login here."}
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;
