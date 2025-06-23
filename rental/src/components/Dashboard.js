import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Dashboard({ children }) {
  return (
    
    <div className="dashboard">
      <Header />
      <div className="dashboard-body">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
