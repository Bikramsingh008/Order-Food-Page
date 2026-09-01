import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import orderRouter from './routes/orderRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// App Config
const app = express()
const port = process.env.PORT || 4000

// Connect to Database and Cloud Services
connectDB()
connectCloudinary()

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:4000"
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// API Endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/order', orderRouter)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: "YummyFood API is healthy & running" })
})

// Serve Built Frontend & Admin as a Single Unified Application
const frontendDist = path.join(__dirname, '../FrontEnd/dist');
const adminDist = path.join(__dirname, '../Admin/dist');

if (fs.existsSync(adminDist)) {
  app.use('/admin-portal', express.static(adminDist));
}

if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
}

// Fallback SPA routing for Express 5 compatibility
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

app.listen(port, () => console.log("Single-link Server running on PORT : " + port))