import React from "react";
import "../css/login.css";

function LoginForm() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome Back</h2>
        <form>
          <label htmlFor="username">Username</label>
          <input type="text" id="username" placeholder="Enter your username" />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" placeholder="Enter your password" />

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
