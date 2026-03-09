import asyncHandler from "express-async-handler";
import prisma from "../db.js";

// @desc    Get all users (Admin only)
// @route   GET /api/users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  res.json(users);
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

// @desc    Get user profile
// @route   GET /api/users/profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  res.json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { name, email },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json(updatedUser);
});

// @desc    Admin: Delete user
// @route   DELETE /api/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  await prisma.user.delete({ where: { id: req.params.id } });
  res.json({ message: "User removed successfully" });
});
