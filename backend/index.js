import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// CONNECT TO DATABASE
connectDB();

// SECURITY MIDDLEWARE
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow images from Cloudinary
}));

// RATE LIMITING
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // 300 requests per window
  message: { success: false, message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 auth attempts per window
  message: { success: false, message: "Too many login attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

// MIDDLEWARES
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());
app.use(compression());
app.use(generalLimiter);

// Apply stricter rate limiting to auth routes
app.use("/api/auth", authLimiter);

// API ROUTES
app.use("/api", routes);

// DEFAULT ROUTE with API documentation 

app.get("/", (req, res) => {
  res.json({
    message: "Inventory & Stock Management System API",
    version: "1.0.0",
    description: "Welcome! Here are the available API endpoints:",
    endpoints: {
      categories: "/api/categories",
      suppliers: "/api/suppliers",
      products: "/api/products",
      stockTransactions: "/api/stock-transactions",
      lowStockAlerts: "/api/products/alerts/low-stock",
    },
  });
});

// GLOBAL ERROR HANDLER
app.use(errorHandler);

// START THE SERVER

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
