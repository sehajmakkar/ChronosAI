import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "../config/axios";
import { useState, useContext } from "react";
import { UserContext } from "../context/user.context";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, setUser } = useContext(UserContext);

  function submitHandler(e) {
    e.preventDefault();
    // axios request to backend
    axios
      .post("/users/login", { email, password })
      .then((res) => {
        // then wala part only works when email and password are correct
        console.log(res.data); // password hide karna mat bhoolna backend controller mein se

        localStorage.setItem("token", res.data.token);
        setUser(res.data.user);

        navigate("/home");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-gray-100">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center">Login</h2>
        <form className="mt-6" onSubmit={submitHandler}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-lg font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          Don&#39;t have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
