import React from "react";
import { Link, Routes, Route } from "react-router-dom";

const AdminPanel = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: "220px", background: "#222", color: "white", padding: "20px" }}>
        <h2 style={{ marginBottom: "20px" }}>⚙️ Admin</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2rem" }}>
            <li><Link to="dashboard" style={{ color: "white", textDecoration: "none" }}>📊 Dashboard</Link></li>
            <li><Link to="products" style={{ color: "white", textDecoration: "none" }}>🍔 Products</Link></li>
            <li><Link to="orders" style={{ color: "white", textDecoration: "none" }}>🛒 Orders</Link></li>
            <li><Link to="users" style={{ color: "white", textDecoration: "none" }}>👤 Users</Link></li>
          </ul>
        </nav>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: "30px" }}>
        <Routes>
          <Route path="dashboard" element={<h1>📊 Dashboard</h1>} />
          <Route path="products" element={<h1>🍔 Manage Products</h1>} />
          <Route path="orders" element={<h1>🛒 Manage Orders</h1>} />
          <Route path="users" element={<h1>👤 Manage Users</h1>} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPanel;
