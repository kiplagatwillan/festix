import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  getOrganizerEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

/**
 * @route   GET /api/events/my-events
 * @desc    Get all events created by the logged-in organizer
 * @access  Private (Organizer/Admin)
 * NOTE: Placed before /:id to avoid route collision
 */
router.get(
  "/my-events",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  getOrganizerEvents,
);

/**
 * @route   GET /api/events
 * @desc    Get all events (supports search/filter via query params)
 * @access  Public
 */
router.get("/", getEvents);

/**
 * @route   POST /api/events
 * @desc    Create a new event with ticket tiers and image upload
 * @access  Private (Organizer/Admin)
 * ✅ upload.single("image") matches frontend data.append("image", file)
 */
router.post(
  "/",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  upload.single("image"),
  createEvent,
);

/**
 * @route   /api/events/:id
 * @desc    Operations on a specific event
 * @access  Public (GET), Private (PUT/DELETE)
 */
router
  .route("/:id")
  .get(getEventById)
  .put(
    protect,
    authorize("ORGANIZER", "ADMIN"),
    upload.single("image"),
    updateEvent,
  )
  .delete(protect, authorize("ORGANIZER", "ADMIN"), deleteEvent);

export default router;
