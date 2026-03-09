import asyncHandler from "express-async-handler";
import prisma from "../db.js";

// @desc    Create a new event
// @route   POST /api/events
export const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    venue,
    date,
    category,
    price,
    totalTickets,
    imageUrl,
  } = req.body;

  const event = await prisma.event.create({
    data: {
      title,
      description,
      venue,
      date: new Date(date),
      category,
      price: parseFloat(price),
      totalTickets: parseInt(totalTickets),
      availableTickets: parseInt(totalTickets),
      imageUrl,
      organizerId: req.user.id,
    },
  });

  res.status(201).json(event);
});

// @desc    Get all events with filters
// @route   GET /api/events
export const getEvents = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, date } = req.query;

  const filters = {
    status: "active",
    AND: [
      search ? { title: { contains: search, mode: "insensitive" } } : {},
      category ? { category: { equals: category } } : {},
      minPrice ? { price: { gte: parseFloat(minPrice) } } : {},
      maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {},
      date ? { date: { gte: new Date(date) } } : {},
    ],
  };

  const events = await prisma.findMany({
    where: filters,
    include: { organizer: { select: { name: true } } },
    orderBy: { date: "asc" },
  });

  res.json(events);
});

// @desc    Get single event details
// @route   GET /api/events/:id
export const getEventById = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: { organizer: { select: { name: true, email: true } } },
  });

  if (!event) {
    res.status(404);
    throw new Error("Event not found");
  }

  res.json(event);
});

// @desc    Update an event
// @route   PUT /api/events/:id
export const updateEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });

  if (
    !event ||
    (event.organizerId !== req.user.id && req.user.role !== "ADMIN")
  ) {
    res.status(403);
    throw new Error("Not authorized to update this event");
  }

  const updatedEvent = await prisma.event.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json(updatedEvent);
});

// @desc    Delete an event (Soft delete or hard delete)
// @route   DELETE /api/events/:id
export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({ where: { id: req.params.id } });

  if (
    !event ||
    (event.organizerId !== req.user.id && req.user.role !== "ADMIN")
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this event");
  }

  await prisma.event.delete({ where: { id: req.params.id } });

  res.json({ message: "Event removed successfully" });
});
