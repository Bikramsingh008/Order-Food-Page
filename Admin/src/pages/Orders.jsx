import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl, currency } from "../App";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const adminToken = token || localStorage.getItem("token");
      const res = await axios.get(`${backendUrl}/api/order/list`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.data.success) {
        setOrders(res.data.orders);
      } else {
        toast.error(res.data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      toast.error(error.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const adminToken = token || localStorage.getItem("token");
      const res = await axios.post(
        `${backendUrl}/api/order/status`,
        { orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      if (res.data.success) {
        toast.success(`Order status updated to "${newStatus}"`);
        fetchOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800 mb-2">🛒 Kitchen & Admin Order Slips</h2>

      {loading ? (
        <p className="text-gray-500">Loading orders list...</p>
      ) : orders.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-lg border text-gray-500">
          No customer orders placed yet.
        </div>
      ) : (
        orders.map((order, idx) => (
          <div
            key={order._id || idx}
            className="bg-white border rounded-xl p-5 shadow-sm flex flex-col gap-4 hover:shadow-md transition"
          >
            {/* Header row */}
            <div className="flex flex-wrap justify-between items-center border-b pb-3 gap-2">
              <div>
                <span className="font-bold text-gray-900 text-lg">Order #{order._id?.substring(0, 8)}</span>
                <span className="text-xs text-gray-500 ml-3">
                  {new Date(order.date || order.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start mt-2 sm:mt-0">
                <span className="text-sm font-semibold text-gray-600">Status:</span>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  className={`px-3 py-2 text-sm font-bold rounded-lg border outline-none cursor-pointer min-h-[44px] ${
                    order.status === "Delivered"
                      ? "bg-green-100 text-green-800 border-green-300"
                      : order.status === "Out for Delivery" || order.status === "Delivery Boy On The Way"
                      ? "bg-purple-100 text-purple-800 border-purple-300"
                      : order.status === "Order Packed" || order.status === "Preparing"
                      ? "bg-orange-100 text-orange-800 border-orange-300"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-800 border-red-300"
                      : "bg-yellow-100 text-yellow-800 border-yellow-300"
                  }`}
                >
                  <option value="Order Placed">📝 Order Placed</option>
                  <option value="Order Packed">📦 Order Packed & Prepared</option>
                  <option value="Delivery Boy On The Way">🛵 Delivery Boy On The Way</option>
                  <option value="Out for Delivery">🚀 Out for Delivery</option>
                  <option value="Delivered">✅ Delivered</option>
                  <option value="Cancelled">❌ Cancelled</option>
                </select>
              </div>
            </div>

            {/* Rating badge if customer rated */}
            {order.rating > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg text-sm flex items-center justify-between text-amber-900">
                <div className="flex items-center gap-2">
                  <span className="text-amber-500 text-lg">{"★".repeat(order.rating)}{"☆".repeat(5 - order.rating)}</span>
                  <span className="font-bold">{order.rating}/5 Stars</span>
                </div>
                {order.review && <span className="italic text-gray-700 font-medium">"{order.review}"</span>}
              </div>
            )}

            {/* Content: Customer details & Order Slip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Customer Column */}
              <div className="bg-gray-50 p-3.5 rounded-lg text-sm text-gray-700">
                <h4 className="font-bold text-gray-900 mb-1">📍 Customer Details</h4>
                <p className="font-semibold text-gray-800">
                  {order.address?.firstName} {order.address?.lastName}
                </p>
                <p className="text-gray-600">📞 {order.address?.phone || "N/A"}</p>
                <p className="text-gray-600">
                  {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.zipcode}
                </p>
                <p className="text-xs text-gray-400 mt-2">Payment: {order.paymentMethod || "COD"}</p>
              </div>

              {/* Order Slip Items Column */}
              <div className="md:col-span-2 bg-amber-50/60 border border-amber-200/80 p-4 rounded-lg">
                <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-1.5">
                  <span>📜 Kitchen Order Slip (Customization Breakdown)</span>
                </h4>
                <div className="flex flex-col gap-2">
                  {order.items?.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className="bg-white p-3 rounded border border-amber-200 shadow-2xs text-sm"
                    >
                      <div className="flex justify-between font-bold text-gray-900">
                        <span>
                          {item.title} <span className="text-amber-700">x{item.quantity}</span>
                        </span>
                        <span>
                          {currency}
                          {(item.itemPrice || item.price) * item.quantity}
                        </span>
                      </div>

                      {/* Condensed Customization Summary Slip */}
                      {item.customizationSummary ? (
                        <div className="mt-1 text-xs font-medium text-orange-900 bg-orange-50 px-2.5 py-1 rounded inline-block">
                          👉 {item.customizationSummary}
                        </div>
                      ) : item.customizations && item.customizations.length > 0 ? (
                        <div className="mt-1 flex flex-wrap gap-1.5">
                          {item.customizations.map((c, cIdx) => {
                            if (c.status === "removed") {
                              return (
                                <span
                                  key={cIdx}
                                  className="text-xs bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded border border-red-200"
                                >
                                  {c.name} ✗
                                </span>
                              );
                            }
                            if (c.status === "extra") {
                              return (
                                <span
                                  key={cIdx}
                                  className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded border border-green-200"
                                >
                                  {c.name} {c.change}
                                </span>
                              );
                            }
                            return null;
                          })}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500 italic mt-1 block">
                          Standard recipe (no modifications)
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-right font-extrabold text-base text-gray-900 border-t border-amber-200 pt-2">
                  Grand Total Amount: <span className="text-amber-600">{currency}{order.amount}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Orders;
