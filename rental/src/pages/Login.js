import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";  // <-- Import Link
import api from "../api/axiosInstance"; // your configured axios instance
import "../css/login.css";

function LoginForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("token/", form);

      const { access, refresh } = res.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Set authorization header for future requests
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      await Swal.fire({
        title: "Login Successful",
        text: "Redirecting to dashboard...",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/dashboard");
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Login failed. Please try again.";

      Swal.fire({
        title: "Login Failed",
        text: msg,
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Retry",
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <button type="submit">Login</button>
        </form>

        {/* Register link below form */}
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#007bff", textDecoration: "none" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
