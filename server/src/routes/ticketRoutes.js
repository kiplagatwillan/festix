import express from "express";
import {
  getUserTickets,
  getTicketById,
  validateTicket,
} from "../controllers/ticketController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

// User Routes
router.get("/my-tickets", protect, getUserTickets);
router.get("/:id", protect, getTicketById);

// Organizer/Admin Routes
router.patch(
  "/:id/validate",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  validateTicket,
);

export default router;
