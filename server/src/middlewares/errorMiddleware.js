/**
 * @desc    Custom Error Class for standardizing API responses
 */
export class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Flag for known errors (404, 400, etc)
    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Handler
export const notFound = (req, res, next) => {
  const error = new ApiError(`Resource Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Global Centralized Error Handler
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "An unexpected error occurred on our server";

  // LOGGING: In production, you would send this to Sentry, Winston, or Datadog
  console.error(`[ERROR] ${req.method} ${req.originalUrl} - ${message}`);
  if (process.env.NODE_ENV !== "production") console.error(err.stack);

  res.status(statusCode).json({
    status: "error",
    message,
    // Hide stack trace in production to prevent leaking server details
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  });
};
