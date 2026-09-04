import mongoose from "mongoose";

let isConnecting = false;

const connectDB = async () => {
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }
    if (isConnecting) {
        return;
    }

    try {
        isConnecting = true;
        const uri = (process.env.MONGODB_URI || "").trim();
        const isVercel = Boolean(process.env.VERCEL);

        // If on Vercel and uri points to localhost or is missing, warn and return early
        if (isVercel) {
            if (!uri || uri.includes("127.0.0.1") || uri.includes("localhost")) {
                console.warn("[MongoDB] Cloud MongoDB Atlas URI not configured. Set MONGODB_URI in Vercel project environment variables.");
                isConnecting = false;
                return;
            }
        }

        if (uri) {
            try {
                const targetUrl = uri.includes('/yummy-food') ? uri : `${uri.replace(/\/+$/, '')}/yummy-food`;
                console.log("[MongoDB] Connecting to database...");
                await mongoose.connect(targetUrl, { serverSelectionTimeoutMS: 5000 });
                console.log("[MongoDB] Connection established successfully.");

                // Trigger auto-seed check asynchronously
                import("../controller/productController.js").then(({ autoSeedIfEmpty }) => {
                    autoSeedIfEmpty();
                }).catch(() => {});

                isConnecting = false;
                return;
            } catch (err) {
                console.warn("[MongoDB] Primary MongoDB connection failed (" + err.message + ")");
            }
        }

        // Only use local fallback when NOT on Vercel
        if (!isVercel) {
            const fallbackUrl = "mongodb://127.0.0.1:27017/yummy-food";
            console.log("[MongoDB] Connecting to local MongoDB fallback:", fallbackUrl);
            await mongoose.connect(fallbackUrl, { serverSelectionTimeoutMS: 3000 });
            console.log("[MongoDB] Local fallback connected.");

            import("../controller/productController.js").then(({ autoSeedIfEmpty }) => {
                autoSeedIfEmpty();
            }).catch(() => {});
        }

    } catch (error) {
        console.error("[MongoDB] Connection Error:", error.message);
    } finally {
        isConnecting = false;
    }
};

export default connectDB;