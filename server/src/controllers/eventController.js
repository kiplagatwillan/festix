import asyncHandler from "express-async-handler";
import prisma from "../db.js";

/* =====================================================
 DEFAULT CATEGORY IMAGES
===================================================== */
const CATEGORY_IMAGES = {
  Music: "http://localhost:5000/uploads/music-default.jpg",
  Sports: "http://localhost:5000/uploads/sports-default.jpg",
  Tech: "http://localhost:5000/uploads/tech-default.jpg",
  General: "http://localhost:5000/uploads/default-event.jpg",
};

/* =====================================================
 CREATE EVENT
===================================================== */
export const createEvent = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    venue,
    date,
    category,
    totalTickets,
    imageUrl,
    ticketTiers,
  } = req.body;

  if (!req.user?.id) {
    return res.status(401).json({ message: "Authorization required" });
  }

  if (!title || !venue || !date || !totalTickets) {
    return res.status(400).json({
      message: "Required fields: title, venue, date, totalTickets",
    });
  }

  // 🔥 STEP 6 FIX: Ensure ticketTiers is provided
  if (!ticketTiers || !Array.isArray(ticketTiers) || ticketTiers.length === 0) {
    return res.status(400).json({
      message:
        "ticketTiers is required. Example: [{name: 'Regular', price: 10, capacity: 100}]",
    });
  }

  const selectedCategory = category || "General";

  let finalImageUrl =
    CATEGORY_IMAGES[selectedCategory] || CATEGORY_IMAGES["General"];

  if (req.file) {
    finalImageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  } else if (imageUrl && imageUrl.trim() !== "") {
    finalImageUrl = imageUrl.trim();
  }

  const finalDescription =
    description?.trim() ||
    `Experience ${selectedCategory} at ${venue}. Join "${title}".`;

  try {
    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: finalDescription,
        venue: venue.trim(),
        date: new Date(date),
        category: selectedCategory,
        totalTickets: parseInt(totalTickets),
        availableTickets: parseInt(totalTickets),
        imageUrl: finalImageUrl,
        organizerId: req.user.id,
        // ✅ Create ticket tiers safely
        ticketTiers: {
          create: ticketTiers.map((tier) => ({
            name: tier.name,
            price: parseFloat(tier.price),
            capacity: parseInt(tier.capacity),
            available: parseInt(tier.capacity),
            description: tier.description || "",
          })),
        },
      },
      include: {
        ticketTiers: true,
      },
    });

    console.log("✅ EVENT CREATED:", event.id);
    res.status(201).json(event);
  } catch (error) {
    console.error("❌ CREATE EVENT ERROR:", error);
    res.status(500).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
});

/* =====================================================
 GET ALL EVENTS
===================================================== */
export const getEvents = asyncHandler(async (req, res) => {
  try {
    const { search = "", category = "", minPrice, maxPrice, date } = req.query;
    const filters = [];

    if (search) {
      filters.push({
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      });
    }

    if (category && category !== "All") {
      filters.push({ category });
    }

    if (date) {
      filters.push({ date: { gte: new Date(date) } });
    }

    if (minPrice || maxPrice) {
      filters.push({
        ticketTiers: {
          some: {
            price: {
              gte: Number(minPrice) || 0,
              lte: Number(maxPrice) || 100000,
            },
          },
        },
      });
    }

    const events = await prisma.event.findMany({
      where: filters.length ? { AND: filters } : {},
      orderBy: { date: "asc" },
      include: {
        organizer: { select: { name: true } },
        ticketTiers: true,
      },
    });

    console.log("🔥 FETCHED EVENTS:", events.length);
    res.status(200).json(events);
  } catch (error) {
    console.error("❌ FETCH EVENTS ERROR:", error);
    res.status(500).json({
      message: "Database query failed",
      error: error.message,
    });
  }
});

/* =====================================================
 GET SINGLE EVENT
===================================================== */
export const getEventById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid event ID" });
  }

  try {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        organizer: { select: { name: true, email: true } },
        ticketTiers: true,
      },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json(event);
  } catch (error) {
    console.error("❌ GET EVENT ERROR:", error);
    res.status(500).json({
      message: "Event retrieval failed",
      error: error.message,
    });
  }
});

/* =====================================================
 GET ORGANIZER EVENTS
===================================================== */
export const getOrganizerEvents = asyncHandler(async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const events = await prisma.event.findMany({
      where: { organizerId: req.user.id },
      orderBy: { createdAt: "desc" },
      include: { ticketTiers: true },
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("❌ MY EVENTS ERROR:", error);
    res.status(500).json({
      message: "Failed to load your events",
      error: error.message,
    });
  }
});

/* =====================================================
 UPDATE EVENT
===================================================== */
export const updateEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Event ID required" });

  try {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updateData = { ...req.body };

    if (updateData.totalTickets !== undefined) {
      const newTotal = parseInt(updateData.totalTickets);
      updateData.totalTickets = newTotal;

      if (event.availableTickets > newTotal) {
        updateData.availableTickets = newTotal;
      }
    }

    if (req.file) {
      updateData.imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    // 🔥 Ensure updated ticketTiers are valid (optional)
    if (updateData.ticketTiers && updateData.ticketTiers.length === 0) {
      return res.status(400).json({
        message: "ticketTiers cannot be empty. Provide at least one tier.",
      });
    }

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    console.error("❌ UPDATE ERROR:", error);
    res.status(500).json({
      message: "Event update failed",
      error: error.message,
    });
  }
});

/* =====================================================
 DELETE EVENT
===================================================== */
export const deleteEvent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ message: "Event ID required" });

  try {
    const event = await prisma.event.findUnique({ where: { id } });

    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId !== req.user.id && req.user.role !== "ADMIN") {
      return res.status(403).json({ message: "Permission denied" });
    }

    await prisma.event.delete({ where: { id } });

    res.status(200).json({
      message: "Event successfully removed",
      id,
    });
  } catch (error) {
    console.error("❌ DELETE ERROR:", error);
    res.status(500).json({
      message: "Deletion failed",
      error: error.message,
    });
  }
});
