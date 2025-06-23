import React, { useState } from "react";
import Swal from "sweetalert2";
import "../App.css";
import Dashboard from "../components/Dashboard";

export default function BookingPagePage() {
  const bookings = [
    { id: 1, property: "Room A", date: "2025-07-01", status: "Pending" },
    { id: 2, property: "Room B", date: "2025-07-10", status: "Paid" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [payment, setPayment] = useState({
    method: "",
    amount: "",
    reference: "",
  });

  const handleOpenModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPayment({ method: "", amount: "", reference: "" });
  };

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    handleCloseModal();

    Swal.fire({
      icon: "success",
      title: "Payment Successful!",
      text: `Payment for ${selectedBooking.property} completed.`,
      confirmButtonColor: "#007bff",
    });
  };

  return (
    <Dashboard>
      <h2>Your Bookings</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "white" }}>
            <th style={cell}>Property</th>
            <th style={cell}>Date</th>
            <th style={cell}>Status</th>
            <th style={cell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={cell}>{b.property}</td>
              <td style={cell}>{b.date}</td>
              <td style={cell}>{b.status}</td>
              <td style={cell}>
                {b.status === "Pending" ? (
                  <button onClick={() => handleOpenModal(b)} style={btn}>
                    Make Payment
                  </button>
                ) : (
                  "✓ Paid"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Payment Modal */}
      {showModal && (
        <div style={overlay}>
          <div style={modal}>
            <h3>Payment for {selectedBooking.property}</h3>
            <form onSubmit={handleSubmitPayment}>
              <input
                type="text"
                name="method"
                placeholder="Payment Method (e.g., M-Pesa)"
                value={payment.method}
                onChange={handlePaymentChange}
                required
                style={input}
              />
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={payment.amount}
                onChange={handlePaymentChange}
                required
                style={input}
              />
              <input
                type="text"
                name="reference"
                placeholder="Transaction Reference"
                value={payment.reference}
                onChange={handlePaymentChange}
                required
                style={input}
              />
              <div style={{ marginTop: "1rem" }}>
                <button type="submit" style={btn}>Submit</button>
                <button type="button" onClick={handleCloseModal} style={cancel}>
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

// Style variables
const cell = {
  padding: "12px",
  textAlign: "left",
};

const btn = {
  backgroundColor: "#rsrcb3",
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
