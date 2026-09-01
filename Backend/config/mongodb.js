import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("MongoDB connection established successfully.");
        });

        const uri = (process.env.MONGODB_URI || "").trim();
        const cleanUri = uri.endsWith('/') ? uri.slice(0, -1) : uri;
        const primaryUrl = cleanUri ? (cleanUri.includes('/yummy-food') ? cleanUri : `${cleanUri}/yummy-food`) : null;
        const fallbackUrl = "mongodb://127.0.0.1:27017/yummy-food";

        if (primaryUrl) {
            try {
                console.log("Attempting MongoDB Atlas connection...");
                await mongoose.connect(primaryUrl, { serverSelectionTimeoutMS: 5000 });
                return;
            } catch (err) {
                console.warn("Primary MongoDB Atlas connection failed/timed out. Attempting local MongoDB connection...");
            }
        }

        console.log("Connecting to local MongoDB fallback:", fallbackUrl);
        await mongoose.connect(fallbackUrl, { serverSelectionTimeoutMS: 5000 });

    } catch (error) {
        console.error("MongoDB Connection Error:", error.message);
        throw error;
    }
};

export default connectDB;