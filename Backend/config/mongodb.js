import mongoose from "mongoose";

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
    if (cached.conn && mongoose.connection.readyState === 1) {
        return cached.conn;
    }

    if (!cached.promise) {
        const uri = (process.env.MONGODB_URI || "").trim();
        const isVercel = Boolean(process.env.VERCEL);

        if (!uri && isVercel) {
            throw new Error("MONGODB_URI is not configured in Vercel Environment Variables.");
        }

        const targetUrl = uri 
            ? (uri.includes('/yummy-food') ? uri : `${uri.replace(/\/+$/, '')}/yummy-food`)
            : "mongodb://127.0.0.1:27017/yummy-food";

        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000,
        };

        console.log("[MongoDB] Connecting to database...");
        cached.promise = mongoose.connect(targetUrl, opts).then((mongooseInstance) => {
            console.log("[MongoDB] Connection established successfully.");
            import("../controller/productController.js").then(({ autoSeedIfEmpty }) => {
                autoSeedIfEmpty();
            }).catch(() => {});
            return mongooseInstance;
        }).catch((err) => {
            cached.promise = null;
            console.error("[MongoDB] Connection Error:", err.message);
            throw err;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
};

export default connectDB;