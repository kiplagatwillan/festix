import asyncHandler from "express-async-handler";
import prisma from "../db.js";

// @desc    Get all tickets for the logged-in user
// @route   GET /api/tickets/my-tickets
export const getUserTickets = asyncHandler(async (req, res) => {
  const tickets = await prisma.ticket.findMany({
    where: { userId: req.user.id },
    include: { event: { select: { title: true, date: true, venue: true } } },
  });
  res.json(tickets);
});

// @desc    Get single ticket details
// @route   GET /api/tickets/:id
export const getTicketById = asyncHandler(async (req, res) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: req.params.id },
    include: {
      event: true,
      user: { select: { name: true, email: true } },
    },
  });

  if (!ticket) {
    res.status(404);
    throw new Error("Ticket not found");
  }

  // Security: Only the owner, an Admin, or an Organizer can view the ticket
  if (
    ticket.userId !== req.user.id &&
    req.user.role !== "ADMIN" &&
    ticket.event.organizerId !== req.user.id
  ) {
    res.status(403);
    throw new Error("Not authorized to view this ticket");
  }

  res.json(ticket);
});

// @desc    Validate/Scan a ticket (Organizers only)
// @route   PATCH /api/tickets/:id/validate
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
    throw new Error("Only the event organizer can validate this ticket");
  }

  if (ticket.status === "used") {
    res.status(400);
    throw new Error("Ticket has already been used");
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: req.params.id },
    data: { status: "used" },
  });

  res.json({ message: "Ticket validated successfully", updatedTicket });
});
