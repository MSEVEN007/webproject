import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PropertiesPage from "./pages/PropertiesPage";
import BookingPage from "./pages/BookingPage";
import MaintenancePage from "./pages/MaintenancePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardPage from "./pages/DashboardPage";
import PaymentPage from "./pages/PaymentPage";
import './App.css';   


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/payment" element={<PaymentPage/>} />
      </Routes>
    </Router>
  );
}

export default App;
