import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "../utils/api";
import {
  FaChartPie,
  FaUtensils,
  FaShoppingBag,
  FaUsers,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaCheckCircle,
  FaTruck,
  FaSync,
  FaClock,
} from "react-icons/fa";
import "./AdminPanel.css";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard, products, orders, users
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Product Modal State
  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "Snacks",
    type: "veg",
    subType: "",
    imageUrl: "",
  });
  const [editCustomizations, setEditCustomizations] = useState([]);
  const handleEditCustRow = () => {
    setEditCustomizations([
      ...editCustomizations,
      { name: "", defaultQty: 1, removable: true, extraPrice: 0 }
    ]);
  };
  const handleEditCustChange = (idx, field, val) => {
    const updated = [...editCustomizations];
    updated[idx][field] = val;
    setEditCustomizations(updated);
  };
  const handleRemoveEditCust = (idx) => {
    setEditCustomizations(editCustomizations.filter((_, i) => i !== idx));
  };

  // Add Product Inline Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "Starters & Snacks",
    type: "veg",
    subType: "",
    imageUrl: "",
  });

  // Customization builder for add form
  const [addCustomizations, setAddCustomizations] = useState([]);
  const handleAddCustRow = () => {
    setAddCustomizations([
      ...addCustomizations,
      { name: "", defaultQty: 1, removable: true, extraPrice: 0 }
    ]);
  };
  const handleAddCustChange = (idx, field, val) => {
    const updated = [...addCustomizations];
    updated[idx][field] = val;
    setAddCustomizations(updated);
  };
  const handleRemoveAddCust = (idx) => {
    setAddCustomizations(addCustomizations.filter((_, i) => i !== idx));
  };

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  const token = localStorage.getItem("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch all initial data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch products
      const prodRes = await axios.get(`${API_URL}/product/list`);
      if (prodRes.data.success) {
        setProducts(prodRes.data.products);
      }

      // Fetch orders (admin)
      try {
        const orderRes = await axios.get(`${API_URL}/order/list`, authHeaders);
        if (orderRes.data.success) {
          setOrders(orderRes.data.orders);
        }
      } catch (e) {
        console.error("Order fetch error:", e);
      }

      // Fetch users (admin)
      try {
        const userRes = await axios.get(`${API_URL}/user/list`, authHeaders);
        if (userRes.data.success) {
          setUsers(userRes.data.users);
        }
      } catch (e) {
        console.error("User fetch error:", e);
      }
    } catch (error) {
      console.error("Admin fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await axios.post(
        `${API_URL}/order/status`,
        { orderId, status: newStatus },
        authHeaders
      );
      if (res.data.success) {
        toast.success(`Order status updated to "${newStatus}"`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        toast.error(res.data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Error updating order status");
    }
  };

  // Open Edit Modal
  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setEditForm({
      title: prod.title || "",
      price: prod.price || "",
      description: prod.description || "",
      category: prod.category || "Starters & Snacks",
      type: prod.type || "veg",
      subType: prod.subType || "",
      imageUrl: prod.img?.[0] || "",
    });
    setEditCustomizations(prod.customizations ? [...prod.customizations] : []);
  };

  // Submit Product Edit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const payload = {
        id: editingProduct._id,
        title: editForm.title,
        price: Number(editForm.price),
        description: editForm.description,
        category: editForm.category,
        type: editForm.type,
        subType: editForm.subType,
        imageUrl: editForm.imageUrl,
        customizations: editCustomizations.filter(c => c.name.trim() !== ""),
      };

      const res = await axios.post(
        `${API_URL}/product/update`,
        payload,
        authHeaders
      );
      if (res.data.success) {
        toast.success("✅ Food item updated successfully!");
        setProducts((prev) =>
          prev.map((p) =>
            p._id === editingProduct._id ? res.data.product : p
          )
        );
        setEditingProduct(null);
      } else {
        toast.error(res.data.message || "Failed to update item");
      }
    } catch (error) {
      console.error("Edit product error:", error);
      toast.error("Error updating food item");
    }
  };

  // Submit Add Product
  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: addForm.title,
        price: Number(addForm.price),
        description: addForm.description,
        category: addForm.category,
        type: addForm.type,
        subType: addForm.subType,
        imageUrl: addForm.imageUrl,
        customizations: addCustomizations.filter(c => c.name.trim() !== ""),
      };

      const res = await axios.post(
        `${API_URL}/product/add`,
        payload,
        authHeaders
      );
      if (res.data.success) {
        toast.success("✨ New food item added to catalog!");
        fetchData();
        setShowAddModal(false);
        setAddForm({
          title: "",
          price: "",
          description: "",
          category: "Starters & Snacks",
          type: "veg",
          subType: "",
          imageUrl: "",
        });
        setAddCustomizations([]);
      } else {
        toast.error(res.data.message || "Failed to add item");
      }
    } catch (error) {
      console.error("Add product error:", error);
      toast.error("Error adding food item");
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await axios.post(
        `${API_URL}/product/remove`,
        { id },
        authHeaders
      );
      if (res.data.success) {
        toast.success(`Removed "${title}" from catalog.`);
        setProducts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(res.data.message || "Failed to remove product");
      }
    } catch (error) {
      console.error("Delete product error:", error);
      toast.error("Error removing product");
    }
  };

  // Metrics calculation
  const totalRevenue = orders.reduce((acc, o) => acc + (o.amount || 0), 0);
  const totalOrders = orders.length;
  const activeProductsCount = products.length;
  const totalUsersCount = users.length;

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-title">
          <span>⚙️</span> YummyAdmin
        </div>
        <ul className="admin-nav">
          <li>
            <button
              className={`admin-nav-item ${
                activeTab === "dashboard" ? "active" : ""
              }`}
              onClick={() => setActiveTab("dashboard")}
            >
              <FaChartPie /> Dashboard Overview
            </button>
          </li>
          <li>
            <button
              className={`admin-nav-item ${
                activeTab === "products" ? "active" : ""
              }`}
              onClick={() => setActiveTab("products")}
            >
              <FaUtensils /> Menu Items ({products.length})
            </button>
          </li>
          <li>
            <button
              className={`admin-nav-item ${
                activeTab === "orders" ? "active" : ""
              }`}
              onClick={() => setActiveTab("orders")}
            >
              <FaShoppingBag /> Customer Orders ({orders.length})
            </button>
          </li>
          <li>
            <button
              className={`admin-nav-item ${
                activeTab === "users" ? "active" : ""
              }`}
              onClick={() => setActiveTab("users")}
            >
              <FaUsers /> Registered Users ({users.length})
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* DASHBOARD OVERVIEW TAB */}
        {activeTab === "dashboard" && (
          <div>
            <div className="admin-page-header">
              <h1 className="admin-page-title">📊 Executive Dashboard</h1>
              <button
                className="brand-btn"
                onClick={fetchData}
                style={{ padding: "10px 18px", fontSize: "0.85rem" }}
              >
                <FaSync /> Refresh Data
              </button>
            </div>

            {/* KPI Cards */}
            <div className="admin-kpi-grid">
              <div className="admin-kpi-card">
                <div className="admin-kpi-icon">💰</div>
                <div>
                  <div className="admin-kpi-val">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <div className="admin-kpi-label">Total Revenue</div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon">📦</div>
                <div>
                  <div className="admin-kpi-val">{totalOrders}</div>
                  <div className="admin-kpi-label">Total Orders Placed</div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon">🍕</div>
                <div>
                  <div className="admin-kpi-val">{activeProductsCount}</div>
                  <div className="admin-kpi-label">Catalog Menu Items</div>
                </div>
              </div>

              <div className="admin-kpi-card">
                <div className="admin-kpi-icon">👥</div>
                <div>
                  <div className="admin-kpi-val">{totalUsersCount}</div>
                  <div className="admin-kpi-label">Registered Customers</div>
                </div>
              </div>
            </div>

            {/* Recent Orders Stream */}
            <h3 style={{ marginBottom: "16px", fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚡</span> Recent Live Customer Orders
            </h3>
            {orders.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>
                No orders placed yet. Place an order from the front-end cart to see it here live!
              </p>
            ) : (
              <div className="admin-table-container">
                {/* Desktop & Tablet Table View */}
                <div className="admin-desktop-table-view">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer Details</th>
                        <th>Items Ordered</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o._id}>
                          <td>
                            <b>#{o._id?.substring(o._id.length - 6)}</b>
                            <div style={{ fontSize: "0.76rem", color: "var(--text-muted)", marginTop: "2px" }}>
                              {new Date(o.date || o.createdAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </td>
                          <td>
                            <div>
                              <b>
                                {o.address?.firstName} {o.address?.lastName}
                              </b>
                            </div>
                            <span style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                              📞 {o.address?.phone || "N/A"}
                            </span>
                          </td>
                          <td>
                            {o.items?.map((it, i) => (
                              <div key={i} style={{ fontSize: "0.85rem", marginBottom: "3px" }}>
                                • {it.title} <b style={{ color: "var(--brand-orange)" }}>(x{it.quantity})</b>
                                {it.customizationSummary && (
                                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", display: "block", marginLeft: "10px" }}>
                                    {it.customizationSummary}
                                  </span>
                                )}
                              </div>
                            ))}
                          </td>
                          <td>
                            <b style={{ color: "var(--brand-orange)", fontSize: "1.05rem" }}>₹{o.amount}</b>
                          </td>
                          <td>
                            <span className="admin-payment-tag">{o.paymentMethod || "COD"}</span>
                          </td>
                          <td>
                            <select
                              className={`status-select ${
                                o.status === "Delivered"
                                  ? "delivered"
                                  : o.status === "Out for Delivery" || o.status === "Arrived at Doorstep"
                                  ? "out-delivery"
                                  : "processing"
                              }`}
                              value={o.status || "Order Placed"}
                              onChange={(e) =>
                                handleStatusUpdate(o._id, e.target.value)
                              }
                            >
                              <option value="Order Placed">📋 Order Received</option>
                              <option value="Cooking Fresh">👨‍🍳 Cooking Fresh</option>
                              <option value="Order Packed">📦 Order Packed</option>
                              <option value="Out for Delivery">🛵 Out for Delivery</option>
                              <option value="Arrived at Doorstep">🚪 Arrived at Doorstep</option>
                              <option value="Delivered">✅ Delivered</option>
                              <option value="Cancelled">❌ Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Responsive Order Cards View */}
                <div className="admin-mobile-cards-view">
                  {orders.slice(0, 5).map((o) => (
                    <div key={o._id} className="admin-mobile-order-card">
                      <div className="admin-card-header">
                        <div>
                          <span className="admin-card-id">#{o._id?.substring(o._id.length - 6)}</span>
                          <span className="admin-card-date">
                            {new Date(o.date || o.createdAt).toLocaleString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <span
                          className={`admin-status-pill ${
                            o.status === "Delivered"
                              ? "delivered"
                              : o.status === "Out for Delivery"
                              ? "out-delivery"
                              : "processing"
                          }`}
                        >
                          {o.status || "Food Processing"}
                        </span>
                      </div>

                      <div className="admin-card-customer">
                        <div className="admin-card-cust-name">
                          👤 {o.address?.firstName} {o.address?.lastName}
                        </div>
                        {o.address?.phone && (
                          <a href={`tel:${o.address.phone}`} className="admin-card-phone">
                            📞 {o.address.phone}
                          </a>
                        )}
                        {o.address?.street && (
                          <div className="admin-card-address">
                            📍 {o.address.street}, {o.address.city}
                          </div>
                        )}
                      </div>

                      <div className="admin-card-items">
                        <div className="admin-card-items-title">
                          Ordered Dishes ({o.items?.length || 0}):
                        </div>
                        {o.items?.map((it, idx) => (
                          <div key={idx} className="admin-card-item-row">
                            <span>• {it.title} <b style={{ color: "var(--brand-orange)" }}>(x{it.quantity})</b></span>
                            <span>₹{(it.itemPrice || it.price) * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="admin-card-footer">
                        <div className="admin-card-financials">
                          <span className="admin-card-total">₹{o.amount}</span>
                          <span className="admin-payment-tag">{o.paymentMethod || "COD"}</span>
                        </div>
                        <div className="admin-card-status-control">
                          <label>Status:</label>
                          <select
                            className={`status-select ${
                              o.status === "Delivered"
                                ? "delivered"
                                : o.status === "Out for Delivery" || o.status === "Arrived at Doorstep"
                                ? "out-delivery"
                                : "processing"
                            }`}
                            value={o.status || "Order Placed"}
                            onChange={(e) =>
                              handleStatusUpdate(o._id, e.target.value)
                            }
                          >
                            <option value="Order Placed">📋 Order Received</option>
                            <option value="Cooking Fresh">👨‍🍳 Cooking Fresh</option>
                            <option value="Order Packed">📦 Order Packed</option>
                            <option value="Out for Delivery">🛵 Out for Delivery</option>
                            <option value="Arrived at Doorstep">🚪 Arrived at Doorstep</option>
                            <option value="Delivered">✅ Delivered</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PRODUCTS MANAGEMENT TAB */}
        {activeTab === "products" && (
          <div>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">🍔 Manage Catalog Products</h1>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                  Edit name, price, category, veg/non-veg status, and images for all dishes.
                </p>
              </div>

              <button
                className="brand-btn"
                onClick={() => setShowAddModal(!showAddModal)}
              >
                <FaPlus /> {showAddModal ? "Cancel" : "Add New Dish"}
              </button>
            </div>

            {/* ─── INLINE ADD DISH FORM ─────────────────────────────────────── */}
            {showAddModal && (
              <div className="admin-add-form-inline">
                <div className="admin-add-form-header">
                  <span>✨ Add New Food Item to Menu</span>
                </div>
                <form onSubmit={handleAddSubmit} className="admin-add-form-body">
                  <div className="admin-add-form-grid">
                    {/* Title */}
                    <div className="form-group">
                      <label>Dish Name / Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Paneer Tikka Roll"
                        value={addForm.title}
                        onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
                        required
                      />
                    </div>

                    {/* Price */}
                    <div className="form-group">
                      <label>Price (₹)</label>
                      <input
                        type="number"
                        placeholder="180"
                        value={addForm.price}
                        onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                        required
                      />
                    </div>

                    {/* Category */}
                    <div className="form-group">
                      <label>Category</label>
                      <select
                        value={addForm.category}
                        onChange={(e) => setAddForm({ ...addForm, category: e.target.value })}
                      >
                        <option value="Breakfast">🥞 Breakfast</option>
                        <option value="Starters & Snacks">🍟 Starters & Snacks</option>
                        <option value="Main Course">🍛 Main Course</option>
                        <option value="Rice & Biryani">🍚 Rice & Biryani</option>
                        <option value="Breads">🫓 Breads</option>
                        <option value="Beverages & Desserts">🥤 Beverages & Desserts</option>
                      </select>
                    </div>

                    {/* Dietary Type */}
                    <div className="form-group">
                      <label>Dietary Type</label>
                      <select
                        value={addForm.type}
                        onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
                      >
                        <option value="veg">🟢 Pure Veg</option>
                        <option value="non-veg">🔴 Non-Veg</option>
                      </select>
                    </div>

                    {/* Image URL */}
                    <div className="form-group full-width">
                      <label>Image URL (Unsplash or direct link)</label>
                      <input
                        type="text"
                        placeholder="https://images.unsplash.com/..."
                        value={addForm.imageUrl}
                        onChange={(e) => setAddForm({ ...addForm, imageUrl: e.target.value })}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea
                        rows={3}
                        placeholder="Describe the dish, ingredients, and taste..."
                        value={addForm.description}
                        onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Customizations Builder */}
                  <div className="admin-cust-builder">
                    <div className="admin-cust-builder-header">
                      <div>
                        <span className="cust-builder-title">🥗 Customizable Ingredients & Add-ons</span>
                        <p className="cust-builder-subtitle">These appear as user-adjustable items in the menu. Leave empty if no customizations.</p>
                      </div>
                      <button type="button" className="admin-cust-add-btn" onClick={handleAddCustRow}>
                        + Add Ingredient
                      </button>
                    </div>

                    {addCustomizations.length === 0 && (
                      <div className="admin-cust-empty">
                        No customizations — users will see "Standard Recipe". Click "+ Add Ingredient" to add options.
                      </div>
                    )}

                    <div className="admin-cust-rows">
                      {addCustomizations.map((item, idx) => (
                        <div key={idx} className="admin-cust-row">
                          <input
                            type="text"
                            placeholder="Ingredient name (e.g. Cheese Slice)"
                            value={item.name}
                            onChange={(e) => handleAddCustChange(idx, "name", e.target.value)}
                            className="cust-row-name"
                            required
                          />
                          <div className="cust-row-fields">
                            <label>Qty:
                              <input
                                type="number"
                                value={item.defaultQty}
                                min={0}
                                onChange={(e) => handleAddCustChange(idx, "defaultQty", Number(e.target.value))}
                                className="cust-row-num"
                              />
                            </label>
                            <label>Extra ₹:
                              <input
                                type="number"
                                value={item.extraPrice}
                                min={0}
                                onChange={(e) => handleAddCustChange(idx, "extraPrice", Number(e.target.value))}
                                className="cust-row-num"
                              />
                            </label>
                            <label className="cust-row-check">
                              <input
                                type="checkbox"
                                checked={item.removable}
                                onChange={(e) => handleAddCustChange(idx, "removable", e.target.checked)}
                              />
                              Removable
                            </label>
                            <button type="button" className="cust-row-remove" onClick={() => handleRemoveAddCust(idx)}>✕</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button type="submit" className="brand-btn admin-add-form-submit">
                    <FaPlus /> Add Dish to Menu
                  </button>
                </form>
              </div>
            )}

            {/* Search Filter */}
            <div style={{ marginBottom: "20px", maxWidth: "400px" }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search food items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: "10px 20px" }}
              />
            </div>

            <div className="admin-table-container">
              {/* Desktop Table View */}
              <div className="admin-desktop-table-view">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Dish Title</th>
                      <th>Category</th>
                      <th>Diet Type</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p._id}>
                        <td>
                          <div style={{ position: "relative" }}>
                            <img
                              src={p.img?.[0]}
                              alt={p.title}
                              style={{
                                width: "70px",
                                height: "70px",
                                borderRadius: "10px",
                                objectFit: "cover",
                                border: "1.5px solid rgba(255, 107, 0, 0.4)",
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <b>{p.title}</b>
                          <div
                            style={{
                              fontSize: "0.78rem",
                              color: "var(--text-muted)",
                              maxWidth: "240px",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {p.description}
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              background: "rgba(255,107,0,0.12)",
                              color: "var(--brand-orange)",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                            }}
                          >
                            {p.category}
                          </span>
                        </td>
                        <td>
                          {p.type === "non-veg" ? (
                            <span className="badge-nonveg">● Non-Veg</span>
                          ) : (
                            <span className="badge-veg">● Pure Veg</span>
                          )}
                        </td>
                        <td>
                          <b style={{ color: "var(--brand-orange)" }}>
                            ₹{Number(p.price).toFixed(2)}
                          </b>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "10px" }}>
                            <button
                              onClick={() => openEditModal(p)}
                              style={{
                                padding: "8px 12px",
                                background: "rgba(59,130,246,0.15)",
                                color: "#3B82F6",
                                border: "1px solid rgba(59,130,246,0.3)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p._id, p.title)}
                              style={{
                                padding: "8px 12px",
                                background: "rgba(239,68,68,0.15)",
                                color: "#EF4444",
                                border: "1px solid rgba(239,68,68,0.3)",
                                borderRadius: "8px",
                                cursor: "pointer",
                                fontWeight: 600,
                              }}
                            >
                              <FaTrash /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Product Cards View */}
              <div className="admin-mobile-cards-view">
                {filteredProducts.map((p) => (
                  <div key={p._id} className="admin-mobile-product-card">
                    <img
                      src={p.img?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                      alt={p.title}
                      className="admin-mobile-prod-img"
                    />
                    <div className="admin-mobile-prod-info">
                      <div className="admin-mobile-prod-title">{p.title}</div>
                      <div className="admin-mobile-prod-meta">
                        <span className="admin-payment-tag">{p.category}</span>
                        <span className={p.type === "non-veg" ? "badge-nonveg" : "badge-veg"}>
                          {p.type === "non-veg" ? "● Non-Veg" : "● Veg"}
                        </span>
                      </div>
                      <div className="admin-mobile-prod-price">₹{Number(p.price).toFixed(2)}</div>
                      <div className="admin-mobile-prod-actions">
                        <button
                          onClick={() => openEditModal(p)}
                          className="admin-prod-btn edit"
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p._id, p.title)}
                          className="admin-prod-btn delete"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS MANAGEMENT TAB */}
        {activeTab === "orders" && (
          <div>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">🛒 Customer Orders Management</h1>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                  All orders placed by users appear here live with address and item details.
                </p>
              </div>
            </div>

            {orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 20px" }}>
                <span style={{ fontSize: "3rem" }}>📦</span>
                <h3>No Customer Orders Yet</h3>
                <p style={{ color: "var(--text-muted)" }}>
                  Add items to cart on the front-end and checkout to test live order processing!
                </p>
              </div>
            ) : (
              <div className="admin-table-container">
                {/* Desktop & Tablet Table View */}
                <div className="admin-desktop-table-view">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID & Date</th>
                        <th>Customer & Address</th>
                        <th>Order Items & Customizations</th>
                        <th>Total Amount</th>
                        <th>Customer Rating</th>
                        <th>Order Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o._id}>
                          <td>
                            <b>#{o._id?.substring(o._id.length - 8)}</b>
                            <div
                              style={{
                                fontSize: "0.78rem",
                                color: "var(--text-muted)",
                                marginTop: "4px",
                              }}
                            >
                              {new Date(o.date || o.createdAt).toLocaleString("en-IN")}
                            </div>
                          </td>
                          <td>
                            <b>
                              {o.address?.firstName} {o.address?.lastName}
                            </b>
                            <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
                              📞 {o.address?.phone}
                            </div>
                            <div
                              style={{
                                fontSize: "0.78rem",
                                color: "var(--text-muted)",
                                maxWidth: "200px",
                                marginTop: "4px",
                              }}
                            >
                              📍 {o.address?.street}, {o.address?.city}
                            </div>
                          </td>
                          <td>
                            {o.items?.map((it, idx) => (
                              <div key={idx} style={{ marginBottom: "6px" }}>
                                <b>{it.title}</b> (x{it.quantity}) — ₹
                                {it.itemPrice || it.price}
                                {it.customizationSummary && (
                                  <div
                                    style={{
                                      fontSize: "0.75rem",
                                      color: "var(--brand-orange)",
                                    }}
                                  >
                                    {it.customizationSummary}
                                  </div>
                                )}
                              </div>
                            ))}
                          </td>
                          <td>
                            <b style={{ fontSize: "1.1rem", color: "var(--brand-orange)" }}>
                              ₹{o.amount}
                            </b>
                            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                              {o.paymentMethod || "COD"}
                            </div>
                          </td>
                          <td>
                            {o.rating > 0 ? (
                              <div>
                                <div style={{ color: "#FFC107", fontWeight: 700, fontSize: "0.95rem" }}>
                                  {"★".repeat(o.rating)}{"☆".repeat(5 - o.rating)} ({o.rating}/5)
                                </div>
                                {o.review && (
                                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", fontStyle: "italic", maxWidth: "160px", marginTop: "2px" }}>
                                    "{o.review}"
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                                {o.status === "Delivered" ? "Pending Rating" : "In Progress"}
                              </span>
                            )}
                          </td>
                          <td>
                            <select
                              className={`status-select ${
                                o.status === "Delivered"
                                  ? "delivered"
                                  : o.status === "Out for Delivery" || o.status === "Arrived at Doorstep"
                                  ? "out-delivery"
                                  : "processing"
                              }`}
                              value={o.status || "Order Placed"}
                              onChange={(e) =>
                                handleStatusUpdate(o._id, e.target.value)
                              }
                            >
                              <option value="Order Placed">📋 Order Received</option>
                              <option value="Cooking Fresh">👨‍🍳 Cooking Fresh</option>
                              <option value="Order Packed">📦 Order Packed</option>
                              <option value="Out for Delivery">🛵 Out for Delivery</option>
                              <option value="Arrived at Doorstep">🚪 Arrived at Doorstep</option>
                              <option value="Delivered">✅ Delivered</option>
                              <option value="Cancelled">❌ Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Responsive Order Cards View */}
                <div className="admin-mobile-cards-view">
                  {orders.map((o) => (
                    <div key={o._id} className="admin-mobile-order-card">
                      <div className="admin-card-header">
                        <div>
                          <span className="admin-card-id">#{o._id?.substring(o._id.length - 8)}</span>
                          <span className="admin-card-date">
                            {new Date(o.date || o.createdAt).toLocaleString("en-IN", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <span
                          className={`admin-status-pill ${
                            o.status === "Delivered"
                              ? "delivered"
                              : o.status === "Out for Delivery"
                              ? "out-delivery"
                              : "processing"
                          }`}
                        >
                          {o.status || "Food Processing"}
                        </span>
                      </div>

                      <div className="admin-card-customer">
                        <div className="admin-card-cust-name">
                          👤 {o.address?.firstName} {o.address?.lastName}
                        </div>
                        {o.address?.phone && (
                          <a href={`tel:${o.address.phone}`} className="admin-card-phone">
                            📞 {o.address.phone}
                          </a>
                        )}
                        {o.address?.street && (
                          <div className="admin-card-address">
                            📍 {o.address.street}, {o.address.city}, {o.address.state}
                          </div>
                        )}
                      </div>

                      <div className="admin-card-items">
                        <div className="admin-card-items-title">
                          Dishes ({o.items?.length || 0}):
                        </div>
                        {o.items?.map((it, idx) => (
                          <div key={idx} className="admin-card-item-row">
                            <span>• {it.title} <b style={{ color: "var(--brand-orange)" }}>(x{it.quantity})</b></span>
                            <span>₹{(it.itemPrice || it.price) * it.quantity}</span>
                            {it.customizationSummary && (
                              <div className="admin-card-item-cust">👉 {it.customizationSummary}</div>
                            )}
                          </div>
                        ))}
                      </div>

                      {o.rating > 0 && (
                        <div style={{ background: "rgba(255, 193, 7, 0.1)", border: "1px solid rgba(255, 193, 7, 0.3)", borderRadius: "8px", padding: "8px 12px", margin: "10px 0" }}>
                          <span style={{ color: "#FFC107", fontWeight: 700, fontSize: "0.9rem" }}>
                            {"★".repeat(o.rating)}{"☆".repeat(5 - o.rating)} ({o.rating}/5 Stars)
                          </span>
                          {o.review && (
                            <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic", marginTop: "2px" }}>
                              "{o.review}"
                            </div>
                          )}
                        </div>
                      )}

                      <div className="admin-card-footer">
                        <div className="admin-card-financials">
                          <span className="admin-card-total">₹{o.amount}</span>
                          <span className="admin-payment-tag">{o.paymentMethod || "COD"}</span>
                        </div>
                        <div className="admin-card-status-control">
                          <label>Status:</label>
                          <select
                            className={`status-select ${
                              o.status === "Delivered"
                                ? "delivered"
                                : o.status === "Out for Delivery" || o.status === "Arrived at Doorstep"
                                ? "out-delivery"
                                : "processing"
                            }`}
                            value={o.status || "Order Placed"}
                            onChange={(e) =>
                              handleStatusUpdate(o._id, e.target.value)
                            }
                          >
                            <option value="Order Placed">📋 Order Received</option>
                            <option value="Cooking Fresh">👨‍🍳 Cooking Fresh</option>
                            <option value="Order Packed">📦 Order Packed</option>
                            <option value="Out for Delivery">🛵 Out for Delivery</option>
                            <option value="Arrived at Doorstep">🚪 Arrived at Doorstep</option>
                            <option value="Delivered">✅ Delivered</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* USERS MANAGEMENT TAB */}
        {activeTab === "users" && (
          <div>
            <div className="admin-page-header">
              <div>
                <h1 className="admin-page-title">👤 Registered Customers Analytics</h1>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                  Detailed profiles of all registered users, total orders placed, and lifetime spend.
                </p>
              </div>
            </div>

            <div className="admin-table-container">
              {/* Desktop Table View */}
              <div className="admin-desktop-table-view">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Customer Name</th>
                      <th>Email Address</th>
                      <th>Registered On</th>
                      <th>Orders Placed</th>
                      <th>Total Spent (₹)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div className="yf-user-avatar">
                              {u.name ? u.name[0].toUpperCase() : "U"}
                            </div>
                            <b>{u.name}</b>
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                            {new Date(u.createdAt).toLocaleDateString("en-IN")}
                          </span>
                        </td>
                        <td>
                          <b style={{ color: "var(--brand-orange)" }}>
                            {u.orderCount || 0} Orders
                          </b>
                        </td>
                        <td>
                          <b>₹{(u.totalSpent || 0).toLocaleString("en-IN")}</b>
                        </td>
                        <td>
                          <span className="badge-veg">● Active Customer</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile User Cards View */}
              <div className="admin-mobile-cards-view">
                {users.map((u) => (
                  <div key={u._id} className="admin-mobile-user-card">
                    <div className="admin-mobile-user-header">
                      <div className="yf-user-avatar">
                        {u.name ? u.name[0].toUpperCase() : "U"}
                      </div>
                      <div>
                        <div className="admin-mobile-user-name">{u.name}</div>
                        <div className="admin-mobile-user-email">{u.email}</div>
                      </div>
                      <span className="badge-veg" style={{ marginLeft: "auto" }}>Active</span>
                    </div>

                    <div className="admin-mobile-user-metrics">
                      <div className="user-metric-item">
                        <span className="user-metric-label">Orders Placed</span>
                        <b className="user-metric-val">{u.orderCount || 0}</b>
                      </div>
                      <div className="user-metric-item">
                        <span className="user-metric-label">Total Spent</span>
                        <b className="user-metric-val" style={{ color: "var(--brand-orange)" }}>
                          ₹{(u.totalSpent || 0).toLocaleString("en-IN")}
                        </b>
                      </div>
                      <div className="user-metric-item">
                        <span className="user-metric-label">Joined On</span>
                        <span className="user-metric-val">
                          {new Date(u.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EDIT PRODUCT MODAL */}
        {editingProduct && (
          <div className="admin-modal-backdrop">
            <div className="admin-modal">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "20px",
                }}
              >
                <h2>✏️ Edit Food Item</h2>
                <button
                  onClick={() => setEditingProduct(null)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "white",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="form-group">
                  <label>Dish Name / Title</label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) =>
                      setEditForm({ ...editForm, price: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "rgba(255,255,255,0.05)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "8px",
                    }}
                  >
                    <option value="Breakfast">🥞 Breakfast</option>
                    <option value="Starters & Snacks">🍟 Starters & Snacks</option>
                    <option value="Main Course">🍛 Main Course</option>
                    <option value="Rice & Biryani">🍚 Rice & Biryani</option>
                    <option value="Breads">🫓 Breads</option>
                    <option value="Beverages & Desserts">🥤 Beverages & Desserts</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Dietary Type</label>
                  <select
                    value={editForm.type}
                    onChange={(e) =>
                      setEditForm({ ...editForm, type: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "rgba(255,255,255,0.05)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "8px",
                    }}
                  >
                    <option value="veg">Pure Veg</option>
                    <option value="non-veg">Non-Veg</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Unsplash Image URL</label>
                  <input
                    type="text"
                    value={editForm.imageUrl}
                    onChange={(e) =>
                      setEditForm({ ...editForm, imageUrl: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                      background: "rgba(255,255,255,0.05)",
                      color: "white",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: "8px",
                    }}
                  />
                </div>

                {/* Customization builder for edit modal */}
                <div className="admin-cust-builder" style={{ marginBottom: "16px" }}>
                  <div className="admin-cust-builder-header">
                    <div>
                      <span className="cust-builder-title">🥗 Customizable Ingredients</span>
                      <p className="cust-builder-subtitle">Adjust ingredients, default quantities, extra charges, or removable flags.</p>
                    </div>
                    <button type="button" className="admin-cust-add-btn" onClick={handleEditCustRow}>
                      + Add Ingredient
                    </button>
                  </div>

                  {editCustomizations.length === 0 && (
                    <div className="admin-cust-empty">
                      Standard Recipe (No customizations). Click "+ Add Ingredient" to add options.
                    </div>
                  )}

                  <div className="admin-cust-rows">
                    {editCustomizations.map((item, idx) => (
                      <div key={idx} className="admin-cust-row">
                        <input
                          type="text"
                          placeholder="Ingredient name (e.g. Extra Mayo)"
                          value={item.name}
                          onChange={(e) => handleEditCustChange(idx, "name", e.target.value)}
                          className="cust-row-name"
                          required
                        />
                        <div className="cust-row-fields">
                          <label>Qty:
                            <input
                              type="number"
                              value={item.defaultQty}
                              min={0}
                              onChange={(e) => handleEditCustChange(idx, "defaultQty", Number(e.target.value))}
                              className="cust-row-num"
                            />
                          </label>
                          <label>Extra ₹:
                            <input
                              type="number"
                              value={item.extraPrice}
                              min={0}
                              onChange={(e) => handleEditCustChange(idx, "extraPrice", Number(e.target.value))}
                              className="cust-row-num"
                            />
                          </label>
                          <label className="cust-row-check">
                            <input
                              type="checkbox"
                              checked={item.removable}
                              onChange={(e) => handleEditCustChange(idx, "removable", e.target.checked)}
                            />
                            Removable
                          </label>
                          <button type="button" className="cust-row-remove" onClick={() => handleRemoveEditCust(idx)}>✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button type="submit" className="brand-btn" style={{ width: "100%", justifyContent: "center" }}>
                  Save & Update Dish
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ADD PRODUCT — handled inline in Products tab above; removed modal */}
      </main>
    </div>
  );
};

export default AdminPanel;
