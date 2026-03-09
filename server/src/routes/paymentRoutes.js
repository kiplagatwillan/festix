import express from "express";
import { createPaymentSession } from "../controllers/paymentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Users must be logged in to initiate a purchase
router.post("/create-checkout-session", protect, createPaymentSession);

export default router;
