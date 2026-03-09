import express from "express";
import {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public Routes
router.route("/").get(getEvents);
router.route("/:id").get(getEventById);

// Protected Routes (Organizers & Admins)
router.post("/", protect, authorize("ORGANIZER", "ADMIN"), createEvent);

router
  .route("/:id")
  .put(protect, authorize("ORGANIZER", "ADMIN"), updateEvent)
  .delete(protect, authorize("ORGANIZER", "ADMIN"), deleteEvent);

export default router;
