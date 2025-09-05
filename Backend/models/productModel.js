import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    title:{type:String, required: true },
    price : {type: Number, required: true},
    img: {type: Array, require: true},
})

const productModel = mongoose.models.product || mongoose.model("product" , productSchema)

export default productModel
