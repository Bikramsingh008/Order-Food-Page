import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const fetchList = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/product/list");
      if (res.data.success) {
        setList(res.data.products);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // 👈 VERY IMPORTANT
          },
        } // ✅ correct
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
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* listTable title */}

        <div className="hidden md:grid grid-cols-[1fr_2fr_2fr_1fr_1fr] items-center py-2 px-3 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Title</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_2fr_2fr_1fr_1fr] items-center gap-2 py-2 px-3 border text-sm"
          >
            {/* Image */}
            <img
              className="w-20 h-20 object-cover rounded"
              src={item.img[0]}
              alt=""
            />

            {/* Title */}
            <p className="truncate">{item.title}</p>

            {/* Price */}
            <p>
              {currency}
              {item.price}
            </p>

            {/* Action */}
            <p
              onClick={() => removeProduct(item._id)}
              className="text-center cursor-pointer text-4xl text-red-500 hover:text-red-700 transition"
            >
              ×
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
