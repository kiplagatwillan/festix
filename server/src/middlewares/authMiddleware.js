import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import prisma from "../db.js"; // Using our central DB instance

// @desc    Protect routes - Verify JWT in cookies
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user and attach to request object
      req.user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: { id: true, name: true, email: true, role: true },
      });

      if (!req.user) {
        res.status(401);
        throw new Error("User not found, authorization denied");
      }

      next();
    } catch (error) {
      console.error("Auth Error:", error.message);
      res.status(401);
      throw new Error("Not authorized, token invalid or expired");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no session token found");
  }
});

// @desc    Authorize specific roles (ADMIN, ORGANIZER, etc.)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Forbidden: Role '${req.user.role}' does not have access`,
      );
    }

    next();
  };
};
