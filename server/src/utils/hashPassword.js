import bcrypt from "bcryptjs";

/**
 * @desc    Generate a secure hash using a high salt factor (12)
 * @param   {string} password - Plain text password
 * @returns {string} Hashed password
 */
export const hashPassword = async (password) => {
  if (!password) throw new Error("Password is required for hashing");
  const salt = await bcrypt.genSalt(12);
  return await bcrypt.hash(password, salt);
};

/**
 * @desc    Compare plain text password with stored hash
 * @param   {string} enteredPassword
 * @param   {string} storedHash
 * @returns {boolean}
 */
export const comparePassword = async (enteredPassword, storedHash) => {
  return await bcrypt.compare(enteredPassword, storedHash);
};
