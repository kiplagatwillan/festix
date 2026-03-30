// src/routes/eventRoutes.js
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

/*
|--------------------------------------------------------------------------
| ORGANIZER ROUTES
|--------------------------------------------------------------------------
| Routes that require authentication and specific roles
| These must come before dynamic :id routes to prevent conflicts
*/
router.get(
  "/my-events",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  getOrganizerEvents,
);

/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
| Accessible to everyone
*/
router.get("/", getEvents);

/*
|--------------------------------------------------------------------------
| CREATE EVENT
|--------------------------------------------------------------------------
| Supports image upload from frontend form
| 'image' must match the frontend input field name
| ✅ TicketTiers validation handled in controller
*/
router.post(
  "/",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  upload.single("image"),
  createEvent,
);

/*
|--------------------------------------------------------------------------
| EVENT BY ID ROUTES
|--------------------------------------------------------------------------
| Dynamic routes that operate on a specific event ID
| Includes GET, PUT (with image support), and DELETE
| ✅ TicketTiers validation handled in controller
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
