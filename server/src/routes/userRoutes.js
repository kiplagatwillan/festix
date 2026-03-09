import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
  getUserById,
} from "../controllers/userController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @desc    User Profile Routes
 * @access  Private (Any logged-in user)
 */
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

/**
 * @desc    Admin User Management
 * @access  Private/Admin
 */
router.route("/").get(protect, authorize("ADMIN"), getAllUsers);

router
  .route("/:id")
  .get(protect, authorize("ADMIN"), getUserById)
  .delete(protect, authorize("ADMIN"), deleteUser);

export default router;
