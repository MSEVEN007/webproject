import React from "react";
import "../App.css";
import Dashboard from "../components/Dashboard";
import CardGrid from "../components/CardGrid";

export default function DashboardPage() {
  return (
    <Dashboard>
      <h2>Tenant Dashboard</h2>
      <CardGrid />
      {/* You can add recent activity or quick links below */}
    </Dashboard>
  );
}
