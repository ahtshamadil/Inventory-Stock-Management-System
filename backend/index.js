import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

// CONNECT TO DATABASE
connectDB();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// START THE SERVER

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
