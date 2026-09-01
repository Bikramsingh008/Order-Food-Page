import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);
      const res = await axios.get(backendUrl + "/api/product/list");
      if (res.data.success) {
        setList(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;
    try {
      const adminToken = token || localStorage.getItem("token");
      const res = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        await fetchList();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">🍔 All Food Items List</h2>
        <span className="text-sm font-semibold text-gray-500">Total: {list.length} Items</span>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : list.length === 0 ? (
        <div className="p-8 text-center bg-white border rounded-lg text-gray-500">
          No food items found in database.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-[1fr_2fr_1.5fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-xs font-bold text-gray-700 rounded-t">
            <span>Image</span>
            <span>Title</span>
            <span>Category</span>
            <span>Type</span>
            <span>Price</span>
            <span className="text-center">Action</span>
          </div>

          {list.map((item, index) => (
            <div
              key={item._id || index}
              className="flex flex-col md:grid md:grid-cols-[1fr_2fr_1.5fr_1fr_1fr_1fr] items-start md:items-center gap-3 py-3 px-4 border bg-white rounded text-sm hover:shadow-xs transition"
            >
              {/* Image & Title Header on Mobile */}
              <div className="flex items-center gap-3 w-full md:w-auto">
                <img
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl border-2 border-amber-500/40 shadow-sm flex-shrink-0"
                  src={item.img?.[0] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
                  alt={item.title}
                />
                <div className="md:hidden">
                  <p className="font-bold text-gray-900 text-base">{item.title}</p>
                  <p className="text-xs text-amber-600 font-medium">
                    ✨ {item.customizations?.length || 0} customizations
                  </p>
                </div>
              </div>

              {/* Title & Customization count on Desktop */}
              <div className="hidden md:block">
                <p className="font-bold text-gray-900">{item.title}</p>
                <p className="text-xs text-amber-600 font-medium">
                  ✨ {item.customizations?.length || 0} customizations
                </p>
              </div>

              {/* Category & Badges Row on Mobile */}
              <div className="flex items-center justify-between w-full md:w-auto gap-2 text-xs md:text-sm">
                <span className="text-gray-600 font-medium">{item.category || "Snacks"}</span>

                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                    item.type === "veg"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.type === "veg" ? "🌱 Veg" : `🍖 Non-Veg`}
                </span>

                <p className="font-extrabold text-gray-900 text-base md:text-sm">
                  {currency}
                  {item.price}
                </p>
              </div>

              {/* Action */}
              <div className="w-full md:w-auto md:text-center mt-2 md:mt-0">
                <button
                  onClick={() => removeProduct(item._id)}
                  className="w-full md:w-auto px-4 py-2 bg-red-100 text-red-600 rounded hover:bg-red-600 hover:text-white font-bold text-xs transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1"
                >
                  Delete 🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default List;
