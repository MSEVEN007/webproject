import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../App.css";
import Dashboard from "../components/Dashboard";

export default function BookingPagePage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      setError("No access token found. Please login.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/booking/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) throw new Error("Unauthorized. Please login again.");
        if (!res.ok) throw new Error("Failed to fetch bookings.");
        return res.json();
      })
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBooking(null);
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    if (!token) {
      Swal.fire("Error", "No access token found. Please login.", "error");
      return;
    }

    if (!selectedBooking || !selectedBooking.id || !selectedBooking.price || !selectedBooking.tenant) {
      Swal.fire("Error", "Booking details are incomplete. Cannot proceed.", "error");
      return;
    }

    const payload = {
      booking: selectedBooking.id,
      tenant: selectedBooking.tenant,
      amount: selectedBooking.price,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
    };

    try {
      const response = await fetch("http://localhost:8000/rentpayment/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit payment.");
      }

      Swal.fire({
        icon: "success",
        title: "Payment Submitted!",
        text: `Payment for Room ${selectedBooking.property} has been recorded.`,
        confirmButtonColor: "#007bff",
      });

      handleCloseModal();
    } catch (error) {
      Swal.fire("Error", error.message || "Failed to make payment.", "error");
    }
  };

  if (loading) return <Dashboard><p>Loading bookings...</p></Dashboard>;
  if (error) return <Dashboard><p>Error: {error}</p></Dashboard>;

  return (
    <Dashboard>
      <h2>Your Bookings</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "white" }}>
            <th style={cell}>Property ID</th>
            <th style={cell}>Start Date</th>
            <th style={cell}>End Date</th>
            <th style={cell}>Price</th>
            <th style={cell}>Status</th>
            <th style={cell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: "12px", textAlign: "center" }}>
                No bookings found.
              </td>
            </tr>
          ) : (
            bookings.map((b) => (
              <tr key={b.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={cell}>{b.property}</td>
                <td style={cell}>{b.start_date}</td>
                <td style={cell}>{b.end_date}</td>
                <td style={cell}>{b.price}</td>
                <td style={cell}>{b.status}</td>
                <td style={cell}>
                  {b.status.toLowerCase() === "pending" ? (
                    <button onClick={() => handleOpenModal(b)} style={btn}>
                      Make Payment
                    </button>
                  ) : (
                    "✓ Paid"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Payment Modal */}
      {showModal && selectedBooking && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Payment for Room {selectedBooking.property}</h3>
            <form onSubmit={handleSubmitPayment}>
              <input
                type="number"
                value={selectedBooking.price}
                readOnly
                style={{ ...input, backgroundColor: "#f1f1f1" }}
              />
              <input
                type="text"
                value={new Date().toISOString().split("T")[0]}
                readOnly
                style={{ ...input, backgroundColor: "#f1f1f1" }}
              />
              <div style={{ marginTop: "1rem" }}>
                <button type="submit" style={btn}>Submit</button>
                <button type="button" onClick={handleCloseModal} style={cancel}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Dashboard>
  );
}

// Styles
const cell = {
  padding: "12px",
  textAlign: "left",
};

const btn = {
  backgroundColor: "#007bff",
  color: "#fff",
  padding: "6px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const cancel = {
  backgroundColor: "#6c757d",
  color: "#fff",
  padding: "6px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginLeft: "10px",
};

const input = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  border: "1px solid #ccc",
  borderRadius: "5px",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const modal = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  width: "400px",
  boxShadow: "0 0 10px rgba(0,0,0,0.3)",
};
