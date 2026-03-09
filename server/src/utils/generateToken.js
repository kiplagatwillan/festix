import jwt from "jsonwebtoken";

/**
 * @desc    Generates JWT and sets it as an HTTP-Only Cookie
 * @param   {Object} res - Express response object
 * @param   {string} userId - The unique user ID from DB
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  // Set JWT as a secure cookie
  res.cookie("jwt", token, {
    httpOnly: true, // Prevents JavaScript access (XSS protection)
    secure: process.env.NODE_ENV !== "development", // Only send over HTTPS in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  });

  return token;
};

export default generateToken;
