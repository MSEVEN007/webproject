import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PropertiesPage from "./pages/PropertiesPage";
import BookingPage from "./pages/BookingPage";
import MaintenancePage from "./pages/MaintenancePage";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import PaymentPage from "./pages/PaymentPage";
import './App.css';
import api from "./api/axiosInstance";

// Set token header if exists
const token = localStorage.getItem("accessToken");
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// PrivateRoute component to guard protected routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/" replace />;
  }
  // Logged in, render the component
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/properties"
          element={
            <PrivateRoute>
              <PropertiesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/booking"
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/maintenance"
          element={
            <PrivateRoute>
              <MaintenancePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          }
        />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
