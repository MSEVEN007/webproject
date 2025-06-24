import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Link } from "react-router-dom"; // <-- import Link
import "../css/register.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    contact_info: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/register/", form);

      Swal.fire({
        title: "Registration Successful",
        text: "You have been registered as a tenant!",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });

      setForm({
        name: "",
        username: "",
        email: "",
        password: "",
        contact_info: "",
      });
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);

      let errorMessage = "An unexpected error occurred.";
      const data = err.response?.data;

      if (data) {
        if (typeof data === "object") {
          errorMessage = Object.entries(data)
            .map(([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(", ") : msg}`)
            .join("\n");
        } else if (typeof data === "string") {
          errorMessage = data;
        }
      }

      Swal.fire({
        title: "Registration Failed",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#d33",
        confirmButtonText: "Try Again",
      });
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Tenant Registration</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />

          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter username"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter password"
            required
          />

          <label htmlFor="contact_info">Contact Number</label>
          <input
            type="tel"
            id="contact_info"
            name="contact_info"
            value={form.contact_info}
            onChange={handleChange}
            placeholder="Enter contact number"
            required
          />

          <button type="submit">Register</button>
        </form>

        {/* Back to login link */}
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#007bff", textDecoration: "none" }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
