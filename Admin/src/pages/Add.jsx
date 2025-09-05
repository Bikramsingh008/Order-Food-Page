import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [name, SetName] = useState("");
  const [price, SetPrice] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", name); // not "name"
      formData.append("price", price);

      formData.append("image1", image1);

      const token = localStorage.getItem("token"); // make sure token exists here
      console.log("Token being sent:", localStorage.getItem("token"));

      const res = await axios.post(
        "http://localhost:4000/api/product/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // 👈 VERY IMPORTANT
          },
        }
      );

      if(res.data.success){
        toast.success(res.data.message)
        SetName('')
        setImage1('')
        SetPrice('')

      } else{
        toast.error(res.data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start"
    >
      <div>
        <p className="mb-3 ">
          <b>Upload Image</b>
        </p>
        <div>
          <label htmlFor="image1">
            <img
              className="w-40 "
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Title</p>
        <input
          onChange={(e) => SetName(e.target.value)}
          value={name}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Type here"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Price</p>
        <input
          onChange={(e) => SetPrice(e.target.value)}
          value={price}
          className="w-full max-w-[500px] px-3 py-2"
          type="Number"
          placeholder="Enter Pice"
          required
        />
      </div>

      <button
        type="submit"
        className="w-28 py-3 mt-4 bg-black text-white cursor-pointer"
      >
        ADD
      </button>
    </form>
  );
};

export default Add;
