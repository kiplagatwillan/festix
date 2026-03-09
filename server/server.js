import dotenv from "dotenv";
import path from "path";
import app from "./app.js";

// Load env vars from the root directory
dotenv.config();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(
    `🚀 Festix Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});

// Handle server-side crashes gracefully
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
