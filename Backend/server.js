import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'

//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middleware
const allowedOrigins = [
  "http://localhost:5173", // Frontend
  "http://localhost:5174"  // Any other UI if needed
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin like Postman
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

//API endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)

app.get('/', (req, res)=>{
    res.send("API Working");
})

app.listen(port, () => console.log("server started on PORT : "+port ))