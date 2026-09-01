import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place User Order
const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: "Cart is empty" });
        }

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address: address || {},
            paymentMethod: paymentMethod || "COD",
            isPaid: paymentMethod === "Online" || paymentMethod === "Card",
            status: "Order Placed",
            date: new Date()
        });

        await newOrder.save();

        // Clear user cart after placing order
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        res.json({ success: true, message: "Order placed successfully!", orderId: newOrder._id });
    } catch (error) {
        console.log("Error placing order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// User Order History
const userOrders = async (req, res) => {
    try {
        const { userId } = req.body;
        const orders = await orderModel.find({ userId }).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// User Rate & Review Order (once delivered)
const rateOrder = async (req, res) => {
    try {
        const { orderId, rating, review } = req.body;

        if (!orderId || !rating) {
            return res.status(400).json({ success: false, message: "Order ID and rating are required" });
        }

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.status !== "Delivered") {
            return res.status(400).json({ success: false, message: "Rating is available only after order is delivered" });
        }

        order.rating = rating;
        order.review = review || "";
        order.ratedAt = new Date();

        await order.save();

        res.json({ success: true, message: "Thank you for your rating & feedback!", order });
    } catch (error) {
        console.log("Error rating order:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin List All Orders
const allOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({}).sort({ date: -1 });
        res.json({ success: true, orders });
    } catch (error) {
        console.log("Error fetching all orders for admin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin Update Order Status
const updateStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        await orderModel.findByIdAndUpdate(orderId, { status });
        res.json({ success: true, message: "Order status updated successfully" });
    } catch (error) {
        console.log("Error updating order status:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export { placeOrder, userOrders, rateOrder, allOrders, updateStatus };
