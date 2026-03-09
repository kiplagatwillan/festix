import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

/**
 * Standard API Limiter: Prevents DDoS/Spam
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per 15 mins
  message: { message: "Too many requests, please try again in 15 minutes." },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
});

/**
 * Auth Limiter: Bruteforce protection for login/register
 */
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, // Max 10 attempts per hour
  message: {
    message:
      "Too many authentication attempts. Please try again after an hour.",
  },
  skipSuccessfulRequests: true, // Only count failures toward the limit
});

/**
 * Speed Limiter: Delays responses instead of blocking
 * Great for preventing scraping or "hammering" endpoints
 */
export const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,
  delayAfter: 50, // After 50 requests in 15 mins...
  delayMs: (hits) => hits * 100, // ...add 100ms delay per additional request
});
