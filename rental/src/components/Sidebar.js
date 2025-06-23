import React from "react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard Home</Link></li>
          <li><Link to="/properties">Properties</Link></li>
          <li><Link to="/booking">Booking</Link></li>
          <li><Link to="/payment">Payment</Link></li>
          <li><Link to="/maintenance">Maintenance</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
