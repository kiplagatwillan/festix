import bcrypt from "bcryptjs";

/**
 * @desc    High-entropy password hashing
 */
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12); // Production standard: 12 rounds
  return await bcrypt.hash(password, salt);
};

/**
 * @desc    Secure password comparison
 */
export const comparePasswords = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};
