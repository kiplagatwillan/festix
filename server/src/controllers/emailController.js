import asyncHandler from "express-async-handler";
import { sendTicketEmail } from "../services/emailService.js";
import prisma from "../db.js";

export const resendTicketEmail = asyncHandler(async (req, res) => {
  const { ticketId } = req.body;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: { event: true, user: true },
  });

  if (!ticket || ticket.userId !== req.user.id) {
    res.status(404);
    throw new Error("Ticket not found or unauthorized");
  }

  await sendTicketEmail(ticket.user.email, {
    eventName: ticket.event.title,
    qrCode: ticket.qrCode,
    price: ticket.pricePaid,
  });

  res.json({ message: "Ticket email resent successfully" });
});
