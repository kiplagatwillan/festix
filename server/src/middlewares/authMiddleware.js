// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import prisma from "../db.js";

/*
|--------------------------------------------------------------------------
| PROTECT ROUTES
|--------------------------------------------------------------------------
| Verifies JWT from cookies or Authorization header and attaches user to request
*/
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Look for token in cookies OR Authorization header
  if (req.cookies?.festix_token) {
    token = req.cookies.festix_token;
  } else if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token found");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      res.status(401);
      throw new Error("User associated with this token no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401);
    throw new Error("Not authorized, token invalid or expired");
  }
});

/*
|--------------------------------------------------------------------------
| AUTHORIZE ROLES
|--------------------------------------------------------------------------
| Usage: authorize("ADMIN", "ORGANIZER")
*/
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Access denied: Role '${req.user.role}' unauthorized`);
    }

    next();
  };
};

/*
|--------------------------------------------------------------------------
| ORGANIZER MIDDLEWARE
|--------------------------------------------------------------------------
| Shortcut for organizer-only routes
*/
export const organizer = (req, res, next) => {
  if (req.user && req.user.role === "ORGANIZER") {
    return next();
  }

  res.status(403);
  throw new Error("Access denied: Organizers only");
};
