import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile, // 1. Add this import
} from "../controllers/authController.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import { protect } from "../middlewares/authMiddleware.js"; // 2. Add this import

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/logout", logoutUser);

// 3. ADD THIS ROUTE:
router.get("/profile", protect, getProfile);

export default router;
