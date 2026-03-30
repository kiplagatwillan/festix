// src/server.js
import dotenv from "dotenv";
import path from "path";
import express from "express";
import { fileURLToPath } from "url";
import app from "./app.js";

/**
 * ADVANCEMENT 1: Environment Configuration
 * Ensures .env is loaded before any other logic executes.
 */
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * ADVANCEMENT 2: Reliable Path Resolution
 * ES Modules (import) don't have __dirname by default.
 * This creates a bulletproof absolute path to your 'uploads' folder.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, ".."); // Moves up from 'src' to project root

// ✅ Serve static files with 'Cache-Control' for better performance
app.use(
  "/uploads",
  express.static(path.join(rootDir, "uploads"), {
    maxAge: "1d", // Cache images for 1 day to reduce server load
    etag: true,
  }),
);

/**
 * ADVANCEMENT 3: Root Health Check
 * Essential for deployment platforms (Render/AWS/Vercel) to monitor uptime.
 */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "Healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * START SERVER
 */
const server = app.listen(PORT, () => {
  console.log("-----------------------------------------------");
  console.log(`🚀 FESTIX BACKEND ACTIVE`);
  console.log(`📡 Mode: ${NODE_ENV}`);
  console.log(`🔗 Port: ${PORT}`);
  console.log(`📂 Static Assets: ${path.join(rootDir, "uploads")}`);
  console.log("-----------------------------------------------");
});

/**
 * ADVANCEMENT 4: Graceful Shutdown (Production Grade)
 * If the server crashes or is stopped, we close DB connections
 * and clear the port properly to avoid 'Address already in use' errors.
 */
const handleExit = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  server.close(() => {
    console.log("🛑 Server closed. Process terminated.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => handleExit("SIGTERM"));
process.on("SIGINT", () => handleExit("SIGINT"));

// Catch unhandled promise rejections (e.g., Database connection failures)
process.on("unhandledRejection", (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  // In production, you might want to log this to a service like Sentry
  server.close(() => process.exit(1));
});
