/**
 * @desc    Restricts access to specific roles
 * @param   {...string} roles - Allowed roles (e.g., 'ADMIN', 'USER')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Safety check: ensure protect middleware was called before this
    if (!req.user) {
      res.status(500);
      throw new Error("Internal Server Error: User context missing");
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Access Denied: ${req.user.role} role is not authorized for this resource`,
      );
    }

    next();
  };
};
