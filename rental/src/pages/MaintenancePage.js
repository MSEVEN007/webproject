import React, { useState } from "react";
import "../App.css";
import Dashboard from "../components/Dashboard";
import Swal from "sweetalert2";

export default function MaintenancePage() {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState({
    room: "",
    issue: "",
    status: "Pending",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = { ...form, id: Date.now() };
    setComplaints([...complaints, newComplaint]);

    Swal.fire({
      icon: "success",
      title: "Complaint Submitted!",
      text: "We will address your issue shortly.",
      confirmButtonColor: "#007bff",
    });

    setForm({ room: "", issue: "", status: "Pending" });
  };

  return (
    <Dashboard>
      <h2>Room Maintenance Complaints</h2>

      {/* Complaint Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <select
          name="room"
          value={form.room}
          onChange={handleChange}
          required
          style={input}
        >
          <option value="">Select Room</option>
          <option value="Room A">Room A</option>
          <option value="Room B">Room B</option>
          <option value="Room C">Room C</option>
        </select>

        <textarea
          name="issue"
          value={form.issue}
          onChange={handleChange}
          placeholder="Describe the issue"
          required
          style={{ ...input, height: "100px" }}
        />

        <button type="submit" style={btn}>Send Complaint</button>
      </form>

      {/* Complaints Table */}
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
              <td style={cell}>{comp.room}</td>
              <td style={cell}>{comp.issue}</td>
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
    status === "Complete"
      ? "green"
      : status === "In Progress"
      ? "orange"
      : "red",
  fontWeight: "bold",
});
