import asyncHandler from "express-async-handler";
import prisma from "../db.js";

const CATEGORY_IMAGES = {
  Music: "http://localhost:5000/uploads/music-default.jpg",
  Sports: "http://localhost:5000/uploads/sports-default.jpg",
  Tech: "http://localhost:5000/uploads/tech-default.jpg",
  Festival: "http://localhost:5000/uploads/festival-default.jpg",
  General: "http://localhost:5000/uploads/default-event.jpg",
};

/* =====================================================
 CREATE EVENT
===================================================== */
export const createEvent = asyncHandler(async (req, res) => {
  let parsedTiers = [];
  try {
    parsedTiers =
      typeof req.body.ticketTiers === "string"
        ? JSON.parse(req.body.ticketTiers)
        : req.body.ticketTiers;
  } catch (error) {
    return res.status(400).json({ message: "Invalid ticketTiers format." });
  }

  const { title, description, venue, date, category, imageUrl } = req.body;

  if (!title || !venue || !date || !parsedTiers || parsedTiers.length === 0) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const calculatedTotal = parsedTiers.reduce(
    (acc, tier) => acc + (parseInt(tier.capacity) || 0),
    0,
  );

  let finalImageUrl = CATEGORY_IMAGES[category] || CATEGORY_IMAGES["General"];
  if (req.file) {
    finalImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  } else if (imageUrl && imageUrl.trim() !== "" && imageUrl !== "undefined") {
    finalImageUrl = imageUrl.trim();
  }

  const event = await prisma.event.create({
    data: {
      title: title.trim(),
      description: description?.trim() || `Experience ${category} at ${venue}.`,
      venue: venue.trim(),
      date: new Date(date),
      category: category || "General",
      totalTickets: calculatedTotal,
      availableTickets: calculatedTotal,
      imageUrl: finalImageUrl,
      organizerId: req.user.id,
      ticketTiers: {
        create: parsedTiers.map((tier) => ({
          name: tier.name,
          price: parseFloat(tier.price) || 0,
          capacity: parseInt(tier.capacity) || 0,
          available: parseInt(tier.capacity) || 0,
          description: tier.description || "",
        })),
      },
    },
    include: { ticketTiers: true },
  });

  res.status(201).json(event);
});

/* =====================================================
 UPDATE EVENT 
===================================================== */
export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { ticketTiers: true },
  });

  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Not authorized" });
  }

  const { title, description, venue, date, category, imageUrl } = req.body;

  const updateData = {
    title: title || event.title,
    description: description || event.description,
    venue: venue || event.venue,
    date: date ? new Date(date) : event.date,
    category: category || event.category,
  };

  // Handle Image Update
  if (req.file) {
    updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  } else if (imageUrl) {
    updateData.imageUrl = imageUrl;
  }

  const updatedEvent = await prisma.event.update({
    where: { id },
    data: updateData,
    include: { ticketTiers: true },
  });

  res.status(200).json(updatedEvent);
});

/* =====================================================
 GET ALL EVENTS
===================================================== */
export const getEvents = asyncHandler(async (req, res) => {
  const { search, category, minPrice, maxPrice, date } = req.query;
  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { venue: { contains: search, mode: "insensitive" } },
    ];
  }
  if (category && category !== "All") where.category = category;
  if (date) where.date = { gte: new Date(date) };
  if (minPrice || maxPrice) {
    where.ticketTiers = {
      some: {
        price: {
          gte: parseFloat(minPrice) || 0,
          lte: parseFloat(maxPrice) || 1000000,
        },
      },
    };
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { date: "asc" },
    include: {
      ticketTiers: {
        select: { price: true, name: true, capacity: true, available: true },
      },
      organizer: { select: { name: true } },
    },
  });

  res.status(200).json(events);
});

/* =====================================================
 GET SINGLE EVENT
===================================================== */
export const getEventById = asyncHandler(async (req, res) => {
  const event = await prisma.event.findUnique({
    where: { id: req.params.id },
    include: {
      organizer: { select: { name: true, email: true } },
      ticketTiers: true,
    },
  });

  if (!event) return res.status(404).json({ message: "Event not found" });
  res.status(200).json(event);
});

/* =====================================================
 GET ORGANIZER EVENTS
===================================================== */
export const getOrganizerEvents = asyncHandler(async (req, res) => {
  const events = await prisma.event.findMany({
    where: { organizerId: req.user.id },
    include: { ticketTiers: true },
    orderBy: { createdAt: "desc" },
  });
  res.status(200).json(events);
});

/* =====================================================
 DELETE EVENT (Fixed with Cascading Transaction)
===================================================== */
export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const event = await prisma.event.findUnique({ where: { id } });

  if (!event) return res.status(404).json({ message: "Event not found" });

  if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Not authorized to delete this event" });
  }

  /**
   * ✅ FIX: Use a Transaction to delete children first.
   * This prevents the "Foreign Key Constraint" 500 error.
   */
  try {
    await prisma.$transaction([
      // 1. Delete associated ticket tiers
      prisma.ticketTier.deleteMany({ where: { eventId: id } }),
      // 2. Delete associated tickets (if applicable in your schema)
      prisma.ticket?.deleteMany({ where: { eventId: id } }),
      // 3. Finally delete the event
      prisma.event.delete({ where: { id } }),
    ]);

    res
      .status(200)
      .json({ message: "Event and associated tiers deleted successfully", id });
  } catch (error) {
    console.error("❌ DELETE TRANSACTION ERROR:", error);
    res
      .status(500)
      .json({ message: "Failed to delete event and its dependencies." });
  }
});
