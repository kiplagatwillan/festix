import asyncHandler from "express-async-handler";
import prisma from "../db.js";

// @desc    Get Global Dashboard Stats (Admin Only)
// @route   GET /api/analytics/admin
export const getAdminStats = asyncHandler(async (req, res) => {
  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
  });

  const userCount = await prisma.user.count();
  const eventCount = await prisma.event.count();
  const ticketCount = await prisma.ticket.count();

  const revenueByCategory = await prisma.event.groupBy({
    by: ["category"],
    _sum: { price: true },
  });

  res.json({
    totalRevenue: totalRevenue._sum.amount || 0,
    totalUsers: userCount,
    totalEvents: eventCount,
    totalTicketsSold: ticketCount,
    revenueByCategory,
  });
});

// @desc    Get Organizer Specific Stats
// @route   GET /api/analytics/organizer
export const getOrganizerStats = asyncHandler(async (req, res) => {
  const organizerId = req.user.id;

  // Get all events by this organizer
  const events = await prisma.event.findMany({
    where: { organizerId },
    include: {
      _count: {
        select: { tickets: true },
      },
    },
  });

  const totalTicketsSold = events.reduce(
    (acc, event) => acc + event._count.tickets,
    0,
  );

  // Calculate total revenue from tickets for this organizer's events
  const revenueData = await prisma.ticket.aggregate({
    where: {
      event: { organizerId },
    },
    _sum: { pricePaid: true },
  });

  res.json({
    myEventsCount: events.length,
    totalTicketsSold,
    totalRevenue: revenueData._sum.pricePaid || 0,
    eventsDetail: events.map((e) => ({
      title: e.title,
      sold: e._count.tickets,
      remaining: e.availableTickets,
    })),
  });
});
