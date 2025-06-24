import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../App.css";
import Dashboard from "../components/Dashboard";
import api from "../api/axiosInstance";

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState({ start_date: "", end_date: "" });
  const [calculatedPrice, setCalculatedPrice] = useState(0);

  useEffect(() => {
    async function fetchProperties() {
      try {
        const response = await api.get("property/");
        setProperties(response.data);
      } catch (err) {
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, []);

  const openModal = (room) => {
    setSelectedRoom(room);
    setForm({ start_date: "", end_date: "" }); // reset form on open
    setCalculatedPrice(0);
    setShowModal(true);
  };

  function calculateMonths(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    let months =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1; // include current month
    return months > 0 ? months : 0;
  }

  // Auto calculate price on date change
  useEffect(() => {
    if (form.start_date && form.end_date && selectedRoom) {
      if (new Date(form.end_date) < new Date(form.start_date)) {
        setCalculatedPrice(0);
        return;
      }
      const months = calculateMonths(form.start_date, form.end_date);
      let pricePerMonth = 0;

      if (selectedRoom.type.toLowerCase() === "single") {
        pricePerMonth = 70000;
      } else if (selectedRoom.type.toLowerCase() === "master") {
        pricePerMonth = 100000;
      } else {
        pricePerMonth = selectedRoom.price;
      }

      setCalculatedPrice(months * pricePerMonth);
    } else {
      setCalculatedPrice(0);
    }
  }, [form.start_date, form.end_date, selectedRoom]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.start_date || !form.end_date) {
      Swal.fire("Error", "Please select start and end dates", "error");
      return;
    }

    if (new Date(form.end_date) < new Date(form.start_date)) {
      Swal.fire("Error", "End date cannot be before start date", "error");
      return;
    }

    if (calculatedPrice === 0) {
      Swal.fire(
        "Error",
        "Invalid price calculated. Please check your dates.",
        "error"
      );
      return;
    }

    const bookingData = {
      property: selectedRoom.id,
      start_date: form.start_date,
      end_date: form.end_date,
      price: calculatedPrice,
      // tenant inferred from backend logged-in user
    };

    try {
      await api.post("booking/", bookingData);

      Swal.fire({
        icon: "success",
        title: "Booking Successful!",
        text: `You booked ${selectedRoom.room_no} (${selectedRoom.type}) from ${form.start_date} to ${form.end_date} for TSh ${calculatedPrice.toLocaleString()}`,
        confirmButtonColor: "#007bff",
      });

      setShowModal(false);
    } catch (err) {
      Swal.fire("Error", "Failed to create booking", "error");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Dashboard>
      <h2>Available Properties</h2>

      {loading && <p>Loading properties...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#007bff", color: "white" }}>
              <th style={cell}>Room No</th>
              <th style={cell}>Type</th>
              <th style={cell}>Price (TSh)</th>
              <th style={cell}>Status</th>
              <th style={cell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((room) => (
              <tr key={room.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={cell}>{room.room_no}</td>
                <td style={cell}>{room.type}</td>
                <td style={cell}>{room.price.toLocaleString()}</td>
                <td style={cell}>{room.status}</td>
                <td style={cell}>
                  {room.status === "Empty" ? (
                    <button onClick={() => openModal(room)} style={bookBtn}>
                      Book
                    </button>
                  ) : (
                    <button disabled style={cancelBtn}>
                      Booked
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>
              Book {selectedRoom.room_no} ({selectedRoom.type})
            </h3>
            <form onSubmit={handleSubmit}>
              <label>Start Date</label>
              <input
                name="start_date"
                type="date"
                value={form.start_date}
                onChange={handleChange}
                required
                style={input}
              />
              <label>End Date</label>
              <input
                name="end_date"
                type="date"
                value={form.end_date}
                onChange={handleChange}
                required
                style={input}
              />
              <label>Price (TSh)</label>
              <input
                name="price"
                type="text"
                value={calculatedPrice.toLocaleString()}
                readOnly
                style={{ ...input, backgroundColor: "#e9ecef" }}
              />

              <div style={{ marginTop: "1rem" }}>
                <button type="submit" style={bookBtn}>
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={cancelBtn}
                >
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

// Styles unchanged
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
  cursor: "not-allowed",
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

