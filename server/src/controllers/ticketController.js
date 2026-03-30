import asyncHandler from "express-async-handler";
import prisma from "../db.js";
import crypto from "crypto";

/* =====================================================
 @desc    Centralized Prisma Error Logger
===================================================== */
const logPrismaError = (error, context) => {
  console.error(`\n❌ [PRISMA ERROR in ${context}]:`);
  console.error(error); // Shows exact Prisma error
  console.error("------------------------------------------\n");
};

/* =====================================================
 @desc    Validate ticket selection (Check availability)
 @route   POST /api/tickets/validate-selection
===================================================== */
export const validateSelection = asyncHandler(async (req, res) => {
  const { tierId, quantity } = req.body;

  if (!tierId || quantity < 1) {
    res.status(400);
    throw new Error("Invalid tier or quantity");
  }

  const tier = await prisma.ticketTier.findUnique({ where: { id: tierId } });

  if (!tier || tier.available < quantity) {
    return res.status(400).json({
      success: false,
      message: "Requested quantity no longer available",
    });
  }

  res.status(200).json({
    success: true,
    message: "Tickets available for checkout",
  });
});

/* =====================================================
 @desc    Purchase ticket (ATOMIC TRANSACTION)
 @route   POST /api/tickets/purchase
===================================================== */
export const purchaseTicket = asyncHandler(async (req, res) => {
  const { eventId, tierId, quantity = 1 } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  if (!eventId || !tierId || quantity < 1) {
    res.status(400);
    throw new Error("Invalid event, tier, or quantity");
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const tier = await tx.ticketTier.findUnique({ where: { id: tierId } });

      if (!tier) throw new Error("Ticket tier not found");
      if (tier.available < quantity)
        throw new Error("Not enough tickets available");

      await tx.ticketTier.update({
        where: { id: tierId },
        data: { available: { decrement: quantity } },
      });

      await tx.event.update({
        where: { id: eventId },
        data: { availableTickets: { decrement: quantity } },
      });

      const tickets = Array.from({ length: quantity }).map(() =>
        tx.ticket.create({
          data: {
            eventId,
            ticketTierId: tierId,
            userId,
            ticketHash: crypto.randomUUID(),
            qrCode: crypto.randomUUID(),
            pricePaid: tier.price,
            status: "VALID",
          },
        }),
      );

      return { tickets, tier, eventId };
    });

    res.status(201).json({
      success: true,
      message: "Tickets purchased successfully",
      data: result,
    });
  } catch (error) {
    logPrismaError(error, "purchaseTicket");
    res.status(500).json({ message: "Purchase failed", error: error.message });
  }
});

/* =====================================================
 @desc    Get logged-in user's tickets (FIXED WITH LOGGING)
 @route   GET /api/tickets/my-tickets
===================================================== */
export const getUserTickets = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    res.status(401);
    throw new Error("Unauthorized");
  }

  try {
    const tickets = await prisma.ticket.findMany({
      where: { userId: req.user.id },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            date: true,
            venue: true,
            imageUrl: true,
            status: true,
          },
        },
        ticketTier: {
          select: { id: true, name: true, price: true },
        },
        payment: {
          select: { status: true, amount: true },
        },
      },
      orderBy: { purchaseDate: "desc" },
    });

    res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });
  } catch (error) {
    logPrismaError(error, "getUserTickets");
    res
      .status(500)
      .json({ message: "Server error fetching tickets", error: error.message });
  }
});

/* =====================================================
 @desc    Get single ticket by ID
===================================================== */
export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    include: {
      event: true,
      ticketTier: true,
      user: { select: { name: true, email: true } },
      payment: true,
    },
  });

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (
    ticket.userId !== req.user.id &&
    req.user.role !== "ADMIN" &&
    ticket.event.organizerId !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized");
  }

  res.status(200).json({ success: true, ticket });
});

/* =====================================================
 @desc    Validate ticket manually
===================================================== */
export const validateTicket = asyncHandler(async (req, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    include: { event: true },
  });

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  if (ticket.event.organizerId !== req.user.id && req.user.role !== "ADMIN") {
    res.status(403);
    throw new Error("Unauthorized");
  }

  if (ticket.status === "USED" || ticket.status === "REFUNDED") {
    res.status(400);
    throw new Error(`Ticket cannot be used (${ticket.status})`);
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: req.params.id },
    data: { status: "USED" },
  });

  res.status(200).json({
    success: true,
    message: "Ticket validated successfully",
    ticket: updatedTicket,
  });
});

/* =====================================================
 @desc    Validate ticket via QR
===================================================== */
export const validateTicketByQR = asyncHandler(async (req, res) => {
  const { ticketHash } = req.body;

  if (!ticketHash) {
    res.status(400);
    throw new Error("QR code is required");
  }

  try {
    const ticket = await prisma.ticket.findUnique({
      where: { ticketHash },
      include: { event: true },
    });

    if (!ticket) throw new Error("Invalid ticket");
    if (ticket.event.organizerId !== req.user.id && req.user.role !== "ADMIN")
      throw new Error("Not authorized");

    if (ticket.status === "USED")
      return res
        .status(200)
        .json({ success: false, message: "Ticket already used", ticket });
    if (ticket.status === "REFUNDED")
      return res
        .status(400)
        .json({ success: false, message: "Refunded ticket cannot be used" });

    const updatedTicket = await prisma.ticket.update({
      where: { ticketHash },
      data: { status: "USED" },
    });

    res.status(200).json({
      success: true,
      message: "Ticket valid ✅ Entry allowed",
      ticket: updatedTicket,
    });
  } catch (error) {
    logPrismaError(error, "validateTicketByQR");
    res
      .status(500)
      .json({ message: "Error validating ticket", error: error.message });
  }
});
