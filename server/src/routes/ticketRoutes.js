import express from "express";
import {
  purchaseTicket,
  getUserTickets,
  getTicketById,
  validateTicket,
  validateTicketByQR,
  validateSelection, // ✅ NEW: Check availability before checkout
} from "../controllers/ticketController.js";

import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

/*
====================================================
 USER ROUTES
====================================================
*/

// 🛑 Check availability for selected tier & quantity before checkout
router.post("/validate-selection", protect, validateSelection);

// 🎟 Purchase ticket
router.post("/purchase", protect, purchaseTicket);

// 🎟 Get logged-in user tickets
router.get("/my-tickets", protect, getUserTickets);

// 🎟 Get single ticket
router.get("/:id", protect, getTicketById);

/*
====================================================
 ORGANIZER / ADMIN ROUTES
====================================================
*/

// 🔍 Scan & validate ticket via QR (IMPORTANT: place before /:id routes if using similar patterns)
router.post(
  "/scan",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  validateTicketByQR,
);

// ✅ Validate ticket manually (by ID)
router.patch(
  "/:id/validate",
  protect,
  authorize("ORGANIZER", "ADMIN"),
  validateTicket,
);

export default router;
