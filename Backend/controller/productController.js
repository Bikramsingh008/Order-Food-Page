import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import { productsData } from "../data/productsData.js";

// Prepare fallback items with deterministic IDs so UI never breaks even if DB is still connecting
const fallbackProducts = productsData.map((item, index) => ({
  ...item,
  _id: `dish_fallback_${index + 1}`,
  id: `dish_fallback_${index + 1}`,
  createdAt: new Date(Date.now() - index * 60000).toISOString()
}));

// Function to auto-seed database if empty
export const autoSeedIfEmpty = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      const count = await productModel.countDocuments();
      if (count === 0) {
        console.log("[MongoDB] Database empty! Auto-seeding default dishes...");
        await productModel.insertMany(productsData);
        console.log(`[MongoDB] Auto-seeded ${productsData.length} food items.`);
      }
    }
  } catch (err) {
    console.warn("[MongoDB] Auto-seed check notice:", err.message);
  }
};

// function for add product
const addProduct = async (req, res) => {
  try {
    const { title, description, price, category, type, subType, imageUrl, customizations } = req.body;
    const image1 = req.files?.image1?.[0];

    let imagesUrl = [];
    if (image1) {
      const result = await cloudinary.uploader.upload(image1.path, {
        resource_type: "image",
      });
      imagesUrl.push(result.secure_url);
    } else if (imageUrl) {
      imagesUrl.push(imageUrl);
    }

    let parsedCustomizations = [];
    if (customizations) {
      try {
        parsedCustomizations = typeof customizations === "string" ? JSON.parse(customizations) : customizations;
      } catch (e) {
        console.log("Error parsing customizations JSON:", e);
      }
    }

    const productData = {
      title,
      description: description || "",
      price: Number(price),
      category: category || "Snacks",
      type: type || "veg",
      subType: subType || "",
      img: imagesUrl.length > 0 ? imagesUrl : ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c"],
      customizations: parsedCustomizations
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Food item added successfully!", product });
  } catch (error) {
    console.log("Error adding product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function for edit/update product
const updateProduct = async (req, res) => {
  try {
    const { id, title, description, price, category, type, subType, imageUrl, customizations } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Product ID required for update" });
    }

    const image1 = req.files?.image1?.[0];
    let updateFields = {};

    if (title) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (price !== undefined) updateFields.price = Number(price);
    if (category) updateFields.category = category;
    if (type) updateFields.type = type;
    if (subType !== undefined) updateFields.subType = subType;

    if (image1) {
      const result = await cloudinary.uploader.upload(image1.path, { resource_type: "image" });
      updateFields.img = [result.secure_url];
    } else if (imageUrl) {
      updateFields.img = [imageUrl];
    }

    if (customizations) {
      try {
        updateFields.customizations = typeof customizations === "string" ? JSON.parse(customizations) : customizations;
      } catch (e) {
        console.log("Error parsing customizations JSON:", e);
      }
    }

    const updatedProduct = await productModel.findByIdAndUpdate(id, updateFields, { new: true });
    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    console.log("Error updating product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function for list product
const listProduct = async (req, res) => {
  try {
    const { category, type } = req.query;
    let filter = {};
    if (category && category !== "All") filter.category = category;
    if (type && type !== "All") filter.type = type;

    if (mongoose.connection.readyState >= 1) {
      const products = await productModel.find(filter).sort({ createdAt: -1 });
      if (products && products.length > 0) {
        return res.json({ success: true, products });
      }
    }

    // Fallback gracefully to default catalog if DB is connecting, empty, or unconfigured
    let result = fallbackProducts;
    if (category && category !== "All") {
      result = result.filter(p => (p.category || "").toLowerCase() === category.toLowerCase());
    }
    if (type && type !== "All") {
      result = result.filter(p => (p.type || "").toLowerCase() === type.toLowerCase());
    }
    return res.json({ success: true, products: result, isFallback: true });
  } catch (error) {
    console.log("Error listing products:", error);
    return res.json({ success: true, products: fallbackProducts, isFallback: true });
  }
};

// function for remove product
const removeProduct = async (req, res) => {
  try {
    const { id } = req.body;
    await productModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Food item removed successfully" });
  } catch (error) {
    console.log("Error removing product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// function for single product info
const singleProduct = async (req, res) => {
  try {
    const productId = req.params.id || req.body.productId || req.query.id;
    if (!productId) {
      return res.status(400).json({ success: false, message: "Product ID required" });
    }

    if (mongoose.connection.readyState >= 1) {
      try {
        const product = await productModel.findById(productId);
        if (product) return res.json({ success: true, product });
      } catch (err) {
        // Not a MongoDB ObjectId or not in DB, continue to fallback match
      }
    }

    // Match in fallback catalog by id, _id or title
    const match = fallbackProducts.find(p =>
      p._id === productId ||
      p.id === productId ||
      String(p.title).toLowerCase() === String(productId).toLowerCase()
    );

    if (match) {
      return res.json({ success: true, product: match });
    }

    res.status(404).json({ success: false, message: "Product not found" });
  } catch (error) {
    console.log("Error getting single product:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { listProduct, addProduct, updateProduct, removeProduct, singleProduct };