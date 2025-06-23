import React, { useState } from "react";
import Swal from "sweetalert2";
import "../App.css";
import Dashboard from "../components/Dashboard";

export default function PropertiesPage() {
  const properties = [
    { id: 1, name: "Room A", location: "Zanzibar", price: "TSh 200,000" },
    { id: 2, name: "Room B", location: "Stone Town", price: "TSh 180,000" },
    { id: 3, name: "Room C", location: "Mtoni", price: "TSh 150,000" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "" });

  const openModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);

    Swal.fire({
      icon: "success",
      title: "Booking Successful!",
      text: `You booked ${selectedRoom.name} in ${selectedRoom.location}`,
      confirmButtonColor: "#007bff",
    });

    // Reset form
    setForm({ name: "", phone: "", date: "" });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dashboard>
      <h2>Available Properties</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "white" }}>
            <th style={cell}>Name</th>
            <th style={cell}>Location</th>
            <th style={cell}>Price</th>
            <th style={cell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {properties.map((room) => (
            <tr key={room.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={cell}>{room.name}</td>
              <td style={cell}>{room.location}</td>
              <td style={cell}>{room.price}</td>
              <td style={cell}>
                <button
                  onClick={() => openModal(room)}
                  style={bookBtn}
                >
                  Book
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Booking Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Book {selectedRoom.name}</h3>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                style={input}
              />
              <input
                name="phone"
                type="text"
                placeholder="Contact Number"
                value={form.phone}
                onChange={handleChange}
                required
                style={input}
              />
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
                style={input}
              />
              <div style={{ marginTop: "1rem" }}>
                <button type="submit" style={bookBtn}>Submit</button>
                <button onClick={() => setShowModal(false)} style={cancelBtn}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Dashboard>
  );
}

// Styles
const cell = { padding: "12px", textAlign: "left" };

const bookBtn = {
  backgroundColor: "#0056b3",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "8px",
};

const cancelBtn = {
  backgroundColor: "#6c757d",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const input = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const modalOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalBox = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
};
