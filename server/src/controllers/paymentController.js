import asyncHandler from "express-async-handler";
import prisma from "../db.js";
import stripe from "../services/stripeService.js";
import { generateTicketInfo } from "../services/qrService.js";

// @desc    Create Stripe Checkout Session
// @route   POST /api/payments/create-session
export const createPaymentSession = asyncHandler(async (req, res) => {
  const { eventId } = req.body;

  const event = await prisma.event.findUnique({ where: { id: eventId } });

  if (!event || event.availableTickets <= 0) {
    res.status(400);
    throw new Error("Event is sold out or unavailable");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: event.title,
            description: `Venue: ${event.venue}`,
          },
          unit_amount: Math.round(event.price * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/events/${eventId}`,
    metadata: {
      userId: req.user.id,
      eventId: eventId,
    },
  });

  res.json({ url: session.url });
});

// @desc    Stripe Webhook: Secure Ticket Generation
// @route   POST /api/payments/webhook
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let stripeEvent;

  try {
    // Verify the webhook is actually from Stripe
    stripeEvent = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    console.error(`Webhook Signature Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const { userId, eventId } = session.metadata;

    // PERFORM ATOMIC TRANSACTION
    // This ensures: 1. Ticket created, 2. Payment logged, 3. Event inventory decreased
    await prisma.$transaction(async (tx) => {
      // 1. Create ticket (temp status)
      const ticket = await tx.ticket.create({
        data: {
          userId,
          eventId,
          pricePaid: session.amount_total / 100,
          ticketHash: "PENDING",
          qrCode: "PENDING",
        },
      });

      // 2. Generate secure QR info using the Ticket ID
      const { qrCodeDataURL, ticketHash } = await generateTicketInfo(ticket.id);

      // 3. Update ticket with real secure data
      await tx.ticket.update({
        where: { id: ticket.id },
        data: {
          ticketHash: ticketHash,
          qrCode: qrCodeDataURL,
          payment: {
            create: {
              stripeId: session.id,
              amount: session.amount_total / 100,
              status: "succeeded",
            },
          },
        },
      });

      // 4. Decrement available tickets
      await tx.event.update({
        where: { id: eventId },
        data: { availableTickets: { decrement: 1 } },
      });
    });

    console.log(`🎟️ Ticket successfully issued for User: ${userId}`);
  }

  res.json({ received: true });
});
