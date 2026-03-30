export const ROLES = {
  ADMIN: "ADMIN",
  ORGANIZER: "ORGANIZER",
  ATTENDEE: "ATTENDEE",
};

export const hasAccess = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};
