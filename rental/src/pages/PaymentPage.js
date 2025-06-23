import React, { useState } from "react";
import "../App.css";
import Dashboard from "../components/Dashboard";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const [bookings, setBookings] = useState([
    { id: 1, room: "Room A", amount: 200000, status: "Unpaid" },
    { id: 2, room: "Room B", amount: 180000, status: "Paid" },
    { id: 3, room: "Room C", amount: 150000, status: "Unpaid" },
  ]);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();

    const updatedBookings = bookings.map((b) =>
      b.id === selectedBooking.id ? { ...b, status: "Paid" } : b
    );
    setBookings(updatedBookings);
    setShowModal(false);
    setPaymentMethod("");

    Swal.fire({
      icon: "success",
      title: "Payment Successful!",
      text: `You have paid for ${selectedBooking.room}.`,
      confirmButtonColor: "#007bff",
    });
  };

  return (
    <Dashboard>
      <h2>My Payments</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "white" }}>
            <th style={cell}>Room</th>
            <th style={cell}>Amount</th>
            <th style={cell}>Status</th>
            <th style={cell}>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr key={b.id} style={{ borderBottom: "1px solid #ccc" }}>
              <td style={cell}>{b.room}</td>
              <td style={cell}>TSh {b.amount.toLocaleString()}</td>
              <td style={cell}>
                <span
                  style={{
                    color: b.status === "Paid" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {b.status}
                </span>
              </td>
              <td style={cell}>
                {b.status === "Unpaid" && (
                  <button style={btn} onClick={() => openModal(b)}>
                    Pay Now
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>Make Payment</h3>
            <form onSubmit={handlePayment}>
              <p>
                <strong>Room:</strong> {selectedBooking.room}
              </p>
              <p>
                <strong>Amount:</strong> TSh{" "}
                {selectedBooking.amount.toLocaleString()}
              </p>
              <select
                required
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={input}
              >
                <option value="">Select Payment Method</option>
                <option value="Mpesa">Mpesa</option>
                <option value="Tigo Pesa">Tigo Pesa</option>
                <option value="Airtel Money">Airtel Money</option>
              </select>
              <button type="submit" style={btn}>
                Confirm Payment
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{ ...btn, backgroundColor: "#ccc", color: "#000", marginLeft: "10px" }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </Dashboard>
  );
}

// Style Helpers
const cell = {
  padding: "12px",
  textAlign: "left",
};

const btn = {
  backgroundColor: "#rsrcb3",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const input = {
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
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalBox = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "10px",
  width: "400px",
  maxWidth: "90%",
};
