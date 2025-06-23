import React, { useState } from "react";
import "../css/register.css";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    contact: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now, just log form data
    console.log("Register data:", form);
    alert("Registered successfully!");
    // Here you can add validation or API call
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Tenant Registration</h2>
        <form onSubmit={handleSubmit}>
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

          <label htmlFor="contact">Contact Number</label>
          <input
            type="tel"
            id="contact"
            name="contact"
            value={form.contact}
            onChange={handleChange}
            placeholder="Enter contact number"
            required
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
