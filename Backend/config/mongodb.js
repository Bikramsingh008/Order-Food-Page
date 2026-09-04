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
        let uri = (process.env.MONGODB_URI || "").trim().replace(/^['"]|['"]$/g, '');
        const isVercel = Boolean(process.env.VERCEL);

        if (!uri && isVercel) {
            throw new Error("MONGODB_URI is not configured in Vercel Environment Variables. Please set MONGODB_URI under Project Settings -> Environment Variables.");
        }

        if (uri.includes("cluster0.xxxxxxx.mongodb.net")) {
            throw new Error("MONGODB_URI contains placeholder domain 'cluster0.xxxxxxx.mongodb.net'. Please replace it with your actual MongoDB Atlas cluster connection string.");
        }

        const targetUrl = uri || "mongodb://127.0.0.1:27017/yummy-food";

        const opts = {
            bufferCommands: false,
            serverSelectionTimeoutMS: 8000,
            dbName: "yummy-food"
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