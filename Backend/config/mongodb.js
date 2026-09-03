import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("MongoDB connection established successfully.");
        });

        mongoose.connection.on('error', (err) => {
            console.error("MongoDB connection error:", err.message);
        });

        const uri = (process.env.MONGODB_URI || "").trim();
        const fallbackUrl = "mongodb://127.0.0.1:27017/yummy-food";

        if (uri) {
            try {
                const targetUrl = uri.includes('/yummy-food') ? uri : `${uri.replace(/\/+$/, '')}/yummy-food`;
                console.log("Connecting to MongoDB:", targetUrl.replace(/\/\/[^@]+@/, '//***:***@'));
                await mongoose.connect(targetUrl, { serverSelectionTimeoutMS: 5000 });
                return;
            } catch (err) {
                console.warn("Primary MongoDB connection failed (" + err.message + "). Connecting to local MongoDB...");
            }
        }

        console.log("Connecting to local MongoDB fallback:", fallbackUrl);
        await mongoose.connect(fallbackUrl, { serverSelectionTimeoutMS: 5000 });

    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
    }
};

export default connectDB;