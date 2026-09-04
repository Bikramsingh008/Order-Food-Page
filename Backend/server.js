import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import mongoose from 'mongoose'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import orderRouter from './routes/orderRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Reliably load environment variables from Backend/.env and root .env
dotenv.config({ path: path.join(__dirname, '.env') })
dotenv.config()

// App Config
const app = express()
const port = process.env.PORT || 4000

// Connect to Database and Cloud Services
connectDB()
connectCloudinary()

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "token"]
}));

app.use(express.json());

// Database connection readiness middleware for serverless requests
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/user') || req.path.startsWith('/product') || req.path.startsWith('/order')) {
    try {
      await connectDB();
      next();
    } catch (e) {
      console.error("[MongoDB] Middleware connection error:", e.message);
      return res.status(500).json({ 
        success: false, 
        message: `Database connection error: ${e.message}. Please check your MONGODB_URI and MongoDB Atlas Network Access IP whitelist (0.0.0.0/0).` 
      });
    }
  } else {
    next();
  }
});

// Health check endpoint
const handleHealth = (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 
    ? "Connected" 
    : (process.env.MONGODB_URI ? "Connecting/Error" : "Disconnected (Atlas URI required for live DB)");

  res.json({ 
    success: true, 
    message: "YummyFood API is healthy & running",
    environment: process.env.VERCEL ? "Vercel Serverless" : "Node Server",
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
};

app.get('/api/health', handleHealth);
app.get('/health', handleHealth);

// API Endpoints - mounted with and without /api prefix for maximum serverless compatibility
app.use('/api/user', userRouter);
app.use('/user', userRouter);

app.use('/api/product', productRouter);
app.use('/product', productRouter);

app.use('/api/order', orderRouter);
app.use('/order', orderRouter);

// Serve Built Frontend & Admin as a Single Unified Application if dist folders exist (when running standalone Node)
const frontendDist = path.join(__dirname, '../FrontEnd/dist');
const adminDist = path.join(__dirname, '../Admin/dist');

if (fs.existsSync(adminDist)) {
  app.use('/admin-portal', express.static(adminDist));
}

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

// Fallback SPA routing (for standalone Node server)
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, message: 'API route not found' });
  }

  if (req.path.startsWith('/admin-portal') && fs.existsSync(adminDist)) {
    return res.sendFile(path.join(adminDist, 'index.html'));
  }

  if (fs.existsSync(frontendDist)) {
    return res.sendFile(path.join(frontendDist, 'index.html'));
  }

  res.send("YummyFood API is running. Build FrontEnd to serve the web UI from this port.");
});

// Only listen directly when not running in Vercel Serverless
if (!process.env.VERCEL) {
  app.listen(port, () => console.log("Server running on PORT : " + port));
}

export default app;