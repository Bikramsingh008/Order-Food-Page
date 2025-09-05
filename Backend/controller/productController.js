//function for add product
import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for add product
const addProduct = async (req, res) => {
  try {
    const { title, price } = req.body;
    const image1 = req.files?.image1?.[0];

    let imagesUrl = [];
    if (image1) {
      const result = await cloudinary.uploader.upload(image1.path, {
        resource_type: "image",
      });
      imagesUrl.push(result.secure_url);
    }

    const productData = {
      title,
      price: Number(price),
      img: imagesUrl,
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Food added", product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


//function for list product
const listProduct = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.json({ success: true, products })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//function for remove product
const removeProduct = async (req, res) => {
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Produce removed" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

//function for single product info
const singleProduct = async (req, res) => {

    try {

        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { listProduct, addProduct, removeProduct, singleProduct }