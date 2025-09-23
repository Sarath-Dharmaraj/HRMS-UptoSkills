// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import eventRoutes from "./routes/eventRoutes.js";
import { testConnection } from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables with explicit path
dotenv.config({ path: join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({ message: "HRMS Backend Server is running!" });
});

// Database connection status endpoint
app.get("/api/health/database", async (req, res) => {
  try {
    const result = await testConnection();
    res.status(result.success ? 200 : 500).json({
      success: result.success,
      message: result.message,
      timestamp: new Date().toISOString(),
      database: process.env.DB_NAME
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection test failed",
      error: error.message
    });
  }
});

// General health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "HRMS Backend Server is healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0"
  });
});

// ✅ Use event routes (real DB logic)
app.use("/api/events", eventRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 HRMS Backend Server running on http://localhost:${PORT}`);
  console.log(`📅 Events API: http://localhost:${PORT}/api/events`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database Status: http://localhost:${PORT}/api/health/database`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
});

// Handle server errors
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
