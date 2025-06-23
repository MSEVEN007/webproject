import React from "react";

const cards = [
  {
    title: "Properties",
    count: 8,
    icon: "🏠",
    bg: "#6779b6",
  },
  {
    title: "Bookings",
    count: 5,
    icon: "📅",
    bg: "#17a2b8",
  },
  {
    title: "Payments",
    count: 3,
    icon: "💳",
    bg: "#92b95e",
  },
  {
    title: "Maintenance",
    count: 2,
    icon: "🛠️",
    bg: "#4a5e72",
  },
];

export default function CardGrid() {
  return (
    <div style={gridContainer}>
      {cards.map((card, index) => (
        <div key={index} style={{ ...cardStyle, backgroundColor: card.bg }}>
          <div style={iconStyle}>{card.icon}</div>
          <div>
            <h3 style={titleStyle}>{card.title}</h3>
            <p style={countStyle}>{card.count}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Style Objects
const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "1rem",
  marginBottom: "2rem",
};

const cardStyle = {
  display: "flex",
  alignItems: "center",
  color: "white",
  padding: "1.5rem",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
};

const iconStyle = {
  fontSize: "2.5rem",
  marginRight: "1rem",
};

const titleStyle = {
  margin: 0,
  fontSize: "1.2rem",
};

const countStyle = {
  margin: 0,
  fontSize: "1.5rem",
  fontWeight: "bold",
};
