import React, { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import Swal from "sweetalert2";

export default function PaymentPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null); // null means create new

  // Fetch payments from backend
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setError("No access token found. Please login.");
      setLoading(false);
      return;
    }

    fetch("http://localhost:8000/rentpayment/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch payments");
        return res.json();
      })
      .then((data) => {
        setPayments(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Open modal for edit or new
  const openModal = (payment = null) => {
    if (payment) {
      setSelectedPayment({ ...payment });
    } else {
      setSelectedPayment({
        tenant: "",
        booking: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),
        status: "Pending",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPayment(null);
  };

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedPayment((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new or edited payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    if (!token) {
      Swal.fire("Error", "No access token found. Please login.", "error");
      return;
    }

    try {
      let url = "http://localhost:8000/rentpayment/";
      let method = "POST";
      if (selectedPayment.id) {
        url += `${selectedPayment.id}/`;
        method = "PUT";
      }

      // Validate required fields
      if (
        !selectedPayment.tenant ||
        !selectedPayment.booking ||
        !selectedPayment.amount ||
        !selectedPayment.date ||
        !selectedPayment.status
      ) {
        Swal.fire("Error", "Please fill in all fields", "error");
        return;
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedPayment),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to save payment");
      }

      const data = await res.json();

      setPayments((prev) => {
        if (method === "POST") {
          return [...prev, data];
        } else {
          return prev.map((p) => (p.id === data.id ? data : p));
        }
      });

      Swal.fire("Success", "Payment saved!", "success");
      closeModal();
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  // Delete payment
  const handleDelete = (id) => {
    const token = localStorage.getItem("accessToken");
    Swal.fire({
      title: "Confirm deletion?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#aaa",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:8000/rentpayment/${id}/`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!res.ok) throw new Error("Failed to delete payment");
          setPayments((prev) => prev.filter((p) => p.id !== id));
          Swal.fire("Deleted!", "Payment has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error", error.message, "error");
        }
      }
    });
  };

  if (loading) return <Dashboard><p>Loading payments...</p></Dashboard>;
  if (error) return <Dashboard><p>Error: {error}</p></Dashboard>;

  return (
    <Dashboard>
      <h2>Rent Payments</h2>
      <button onClick={() => openModal(null)} style={{...btn, marginBottom: "1rem"}}>
        Add New Payment
      </button>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#007bff", color: "white" }}>
            <th style={cell}>ID</th>
            <th style={cell}>Tenant ID</th>
            <th style={cell}>Booking ID</th>
            <th style={cell}>Amount</th>
            <th style={cell}>Date</th>
            <th style={cell}>Status</th>
            <th style={cell}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ padding: "12px", textAlign: "center" }}>
                No payments found.
              </td>
            </tr>
          ) : (
            payments.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={cell}>{p.id}</td>
                <td style={cell}>{p.tenant}</td>
                <td style={cell}>{p.booking}</td>
                <td style={cell}>TSh {Number(p.amount).toLocaleString()}</td>
                <td style={cell}>{p.date}</td>
                <td style={cell}>{p.status}</td>
                <td style={cell}>
                  <button style={btn} onClick={() => openModal(p)}>Edit</button>
                  <button
                    style={{ ...btn, backgroundColor: "#dc3545", marginLeft: "5px" }}
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3>{selectedPayment?.id ? "Edit Payment" : "Add New Payment"}</h3>
            <form onSubmit={handleSubmit}>
              <label>Tenant ID:</label>
              <input
                type="number"
                name="tenant"
                value={selectedPayment.tenant}
                onChange={handleChange}
                required
                style={input}
              />
              <label>Booking ID:</label>
              <input
                type="number"
                name="booking"
                value={selectedPayment.booking}
                onChange={handleChange}
                required
                style={input}
              />
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={selectedPayment.amount}
                onChange={handleChange}
                required
                step="0.01"
                style={input}
              />
              <label>Date:</label>
              <input
                type="date"
                name="date"
                value={selectedPayment.date}
                onChange={handleChange}
                required
                style={input}
              />
              <label>Status:</label>
              <select
                name="status"
                value={selectedPayment.status}
                onChange={handleChange}
                required
                style={input}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
                <option value="Overdue">Overdue</option>
              </select>
              <div style={{ marginTop: "1rem" }}>
                <button type="submit" style={btn}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ ...btn, backgroundColor: "#ccc", color: "#000", marginLeft: "10px" }}
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

// Styles
const cell = {
  padding: "12px",
  textAlign: "left",
};

const btn = {
  backgroundColor: "#007bff",
  color: "white",
  padding: "6px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const input = {
  width: "100%",
  padding: "8px",
  margin: "6px 0",
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
  zIndex: 1000,
};

const modalBox = {
  backgroundColor: "white",
  padding: "2rem",
  borderRadius: "8px",
  width: "400px",
  maxWidth: "90%",
};
