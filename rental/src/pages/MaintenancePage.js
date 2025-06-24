import React, { useState, useEffect } from "react";
import "../App.css";
import Dashboard from "../components/Dashboard";
import Swal from "sweetalert2";

export default function MaintenancePage() {
  const [complaints, setComplaints] = useState([]);
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({
    property: "", // property id
    description: "",
    status: "Requested",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch properties & complaints on mount
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("No access token found. Please login.");
      setLoading(false);
      return;
    }

    // Fetch properties
    fetch("http://localhost:8000/property/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch properties.");
        return res.json();
      })
      .then((data) => setProperties(data))
      .catch((err) => setError(err.message));

    // Fetch complaints
    fetch("http://localhost:8000/maintenance/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch complaints.");
        return res.json();
      })
      .then((data) => setComplaints(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire("Error", "Please login to submit complaints.", "error");
      return;
    }
    if (!form.property || !form.description) {
      Swal.fire("Error", "Please select a room and describe the issue.", "error");
      return;
    }

    const payload = {
      property: parseInt(form.property),
      description: form.description,
      status: "Requested",
    };

    try {
      const res = await fetch("http://localhost:8000/maintenance/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to submit complaint.");
      }

      const newComplaint = await res.json();
      setComplaints((prev) => [...prev, newComplaint]);

      Swal.fire("Success", "Complaint submitted!", "success");
      setForm({ property: "", description: "", status: "Requested" });
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  if (loading) return <Dashboard><p>Loading...</p></Dashboard>;
  if (error) return <Dashboard><p>Error: {error}</p></Dashboard>;

  return (
    <Dashboard>
      <h2>Room Maintenance Complaints</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <select
          name="property"
          value={form.property}
          onChange={handleChange}
          required
          style={input}
        >
          <option value="">Select Room</option>
          {properties.map((p) => (
            <option key={p.id} value={p.id}>
              {p.room_no} {/* Display room_no */}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Describe the issue"
          required
          style={{ ...input, height: "100px" }}
        />

        <button type="submit" style={btn}>Send Complaint</button>
      </form>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "white" }}>
            <th style={cell}>Room</th>
            <th style={cell}>Issue</th>
            <th style={cell}>Status</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((comp) => (
            <tr key={comp.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={cell}>{comp.property?.room_no || `Room ${comp.property}`}</td>
              <td style={cell}>{comp.description}</td>
              <td style={cell}>
                <span style={statusStyle(comp.status)}>{comp.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Dashboard>
  );
}

// Styles
const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const btn = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const cell = {
  padding: "12px",
  textAlign: "left",
};

const statusStyle = (status) => ({
  color:
    status === "Completed"
      ? "green"
      : status === "In Progress"
      ? "orange"
      : "red",
  fontWeight: "bold",
});
