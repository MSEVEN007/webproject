import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function CardGrid() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const res = await api.get("dashboard-counts/");
        setCounts(res.data);
      } catch (err) {
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchCounts();
  }, []);

  if (loading) return <p>Loading dashboard data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-cards" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
      <Card title="Bookings" count={counts.bookings} color="#4caf50" />
      <Card title="Payments" count={counts.payments} color="#2196f3" />
      <Card title="Maintenance Requests" count={counts.maintenance} color="#f44336" />
    </div>
  );
}

function Card({ title, count, color }) {
  return (
    <div
      style={{
        flex: "1 1 150px",
        backgroundColor: color,
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h3>{title}</h3>
      <p style={{ fontSize: "2rem", margin: 0 }}>{count}</p>
    </div>
  );
}
