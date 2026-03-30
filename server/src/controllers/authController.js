// src/controllers/authController.js
import asyncHandler from "express-async-handler";
import prisma from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/*
====================================================
 Generate JWT Token
====================================================
*/
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

/*
====================================================
 @desc    Register new user
 @route   POST /api/auth/register
 @access  Public
====================================================
*/
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please add all required fields: name, email, password");
  }

  const normalizedEmail = email.toLowerCase();

  const userExists = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const allowedRoles = ["USER", "ORGANIZER", "ADMIN"];
  const userRole = allowedRoles.includes(role) ? role : "USER";

  const user = await prisma.user.create({
    data: { name, email: normalizedEmail, passwordHash, role: userRole },
  });

  res.status(201).json({
    token: generateToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

/*
====================================================
 @desc    Login user
 @route   POST /api/auth/login
 @access  Public
====================================================
*/
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const normalizedEmail = email.toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    token: generateToken(user.id),
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

/*
====================================================
 @desc    Logout user
 @route   POST /api/auth/logout
 @access  Public
====================================================
*/
export const logoutUser = asyncHandler(async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});

/*
====================================================
 @desc    Get logged in user profile
 @route   GET /api/auth/profile
 @access  Private
====================================================
*/
export const getProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});
