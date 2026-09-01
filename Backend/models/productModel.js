import mongoose from "mongoose";

const customizationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    defaultQty: { type: Number, default: 1 },
    removable: { type: Boolean, default: true },
    extraPrice: { type: Number, default: 0 },
    icon: { type: String, default: "" }
});

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    category: { type: String, required: true }, // Snacks, Breakfast, Lunch, Dinner, Drinks
    type: { type: String, required: true }, // veg, non-veg
    subType: { type: String, default: "" }, // chicken, mutton, egg, fish, paneer, veg, etc.
    img: { type: Array, required: true },
    customizations: [customizationSchema]
}, { timestamps: true });

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
