import React, { useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [image1, setImage1] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Snacks");
  const [type, setType] = useState("veg");
  const [subType, setSubType] = useState("veg");

  // Customization builder array
  const [customizations, setCustomizations] = useState([
    { name: "Default Base Ingredient", defaultQty: 1, removable: false, extraPrice: 0, icon: "" }
  ]);

  const handleAddCustomizationRow = () => {
    setCustomizations([
      ...customizations,
      { name: "", defaultQty: 1, removable: true, extraPrice: 10, icon: "" }
    ]);
  };

  const handleCustomChange = (index, field, value) => {
    const updated = [...customizations];
    updated[index][field] = value;
    setCustomizations(updated);
  };

  const handleRemoveCustomRow = (index) => {
    setCustomizations(customizations.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("type", type);
      formData.append("subType", type === "non-veg" ? subType : "veg");
      formData.append("customizations", JSON.stringify(customizations));

      if (image1) {
        formData.append("image1", image1);
      } else if (imageUrl) {
        formData.append("imageUrl", imageUrl);
      }

      const adminToken = token || localStorage.getItem("token");

      const res = await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (res.data.success) {
        toast.success(res.data.message || "Food added successfully!");
        setName("");
        setDescription("");
        setPrice("");
        setImage1(false);
        setImageUrl("");
        setCategory("Snacks");
        setType("veg");
        setSubType("veg");
        setCustomizations([
          { name: "Default Base Ingredient", defaultQty: 1, removable: false, extraPrice: 0, icon: "" }
        ]);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-4 max-w-[700px] bg-white p-6 rounded-xl border shadow-xs">
      <h2 className="text-xl font-bold text-gray-800">🍔 Add New Food Item</h2>

      {/* Main Image Upload */}
      <div className="w-full">
        <p className="mb-2 font-semibold">Food Image Upload / URL</p>
        <div className="flex items-center gap-4">
          <label htmlFor="image1" className="cursor-pointer">
            <img
              className="w-28 h-28 object-cover rounded-lg border-2 border-dashed border-gray-300"
              src={!image1 ? (imageUrl || assets.upload_area) : URL.createObjectURL(image1)}
              alt=""
            />
            <input
              onChange={(e) => setImage1(e.target.files[0])}
              type="file"
              id="image1"
              hidden
            />
          </label>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Or paste image URL directly:</p>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="w-full">
        <p className="mb-1 font-semibold text-sm">Food Title / Name</p>
        <input
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="w-full px-3 py-2 border rounded-md"
          type="text"
          placeholder="e.g. Deluxe Paneer Burger"
          required
        />
      </div>

      {/* Description */}
      <div className="w-full">
        <p className="mb-1 font-semibold text-sm">Description</p>
        <textarea
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          className="w-full px-3 py-2 border rounded-md"
          rows={3}
          placeholder="Detailed delicious description of the dish..."
          required
        />
      </div>

      {/* Category, Type & Price Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full">
        <div>
          <p className="mb-1 font-semibold text-sm">Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border rounded-md min-h-[44px]"
          >
            <option value="Snacks">Snacks</option>
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Drinks">Drinks</option>
          </select>
        </div>

        <div>
          <p className="mb-1 font-semibold text-sm">Dietary Type</p>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 border rounded-md min-h-[44px]"
          >
            <option value="veg">🟢 Pure Veg</option>
            <option value="non-veg">🔴 Non-Veg</option>
          </select>
        </div>

        {type === "non-veg" && (
          <div>
            <p className="mb-1 font-semibold text-sm">Meat / Egg Type</p>
            <select
              value={subType}
              onChange={(e) => setSubType(e.target.value)}
              className="w-full px-3 py-2 border rounded-md min-h-[44px]"
            >
              <option value="chicken">Chicken</option>
              <option value="mutton">Mutton</option>
              <option value="egg">Egg</option>
              <option value="fish">Fish</option>
            </select>
          </div>
        )}

        <div>
          <p className="mb-1 font-semibold text-sm">Base Price (₹)</p>
          <input
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            className="w-full px-3 py-2 border rounded-md min-h-[44px]"
            type="number"
            placeholder="150"
            required
          />
        </div>
      </div>

      {/* Interactive Ingredient Customization Builder */}
      <div className="w-full border-t pt-4 mt-2">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-gray-800 text-sm sm:text-base">🥗 Customizable Ingredients & Components</h3>
          <button
            type="button"
            onClick={handleAddCustomizationRow}
            className="px-3 py-2 bg-green-600 text-white rounded text-xs font-bold hover:bg-green-700 min-h-[38px]"
          >
            + Add Ingredient
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-3">Define included components & additional extra pricing.</p>

        <div className="flex flex-col gap-3">
          {customizations.map((item, idx) => (
            <div key={idx} className="flex flex-wrap items-center gap-2 bg-gray-50 p-2.5 rounded border text-xs">
              <input
                type="text"
                placeholder="Ingredient Name (e.g. Cheese Slice)"
                value={item.name}
                onChange={(e) => handleCustomChange(idx, "name", e.target.value)}
                className="px-2 py-1.5 border rounded flex-1 min-w-[140px] min-h-[38px]"
                required
              />

              <div className="flex items-center gap-1">
                <label className="text-gray-600">Default Qty:</label>
                <input
                  type="number"
                  value={item.defaultQty}
                  onChange={(e) => handleCustomChange(idx, "defaultQty", Number(e.target.value))}
                  className="w-12 px-1.5 py-1 border rounded text-center min-h-[38px]"
                  min={0}
                />
              </div>

              <div className="flex items-center gap-1">
                <label className="text-gray-600">Extra Price (₹):</label>
                <input
                  type="number"
                  value={item.extraPrice}
                  onChange={(e) => handleCustomChange(idx, "extraPrice", Number(e.target.value))}
                  className="w-16 px-1.5 py-1 border rounded text-center min-h-[38px]"
                  min={0}
                />
              </div>

              <label className="flex items-center gap-1 cursor-pointer min-h-[38px] px-1">
                <input
                  type="checkbox"
                  checked={item.removable}
                  onChange={(e) => handleCustomChange(idx, "removable", e.target.checked)}
                />
                <span>Removable?</span>
              </label>

              <button
                type="button"
                onClick={() => handleRemoveCustomRow(idx)}
                className="text-red-500 font-bold px-2 py-1 hover:text-red-700 min-h-[38px]"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full py-3.5 mt-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg cursor-pointer transition shadow-sm min-h-[48px]"
      >
        ADD FOOD ITEM TO MENU
      </button>
    </form>
  );
};

export default Add;
