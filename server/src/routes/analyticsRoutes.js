import express from "express";
import {
  getAdminStats,
  getOrganizerStats,
} from "../controllers/analyticsController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin-only global analytics
router.get("/admin", protect, authorize("ADMIN"), getAdminStats);

// Organizer (and Admin) analytics for their own events
router.get(
  "/organizer",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  getOrganizerStats,
);

export default router;
