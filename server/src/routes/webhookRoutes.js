import express from "express";
import { stripeWebhook } from "../controllers/paymentController.js";

const router = express.Router();

// Use express.raw for signature verification
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhook,
);

export default router;
