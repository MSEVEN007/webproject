import React from "react";
import "../App.css";
import Dashboard from "../components/Dashboard";
import CardGrid from "../components/CardGrid";

export default function DashboardPage() {
  return (
    <Dashboard>
      <h2 className="dashboard-title">Tenant Dashboard</h2>
      <CardGrid />
      {/* Add more dashboard components here if needed */}
    </Dashboard>
  );
}
