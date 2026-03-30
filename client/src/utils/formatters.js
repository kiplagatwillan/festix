/**
 * Formats a number into a USD currency string.
 * Example: 50 -> $50.00
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Formats an ISO date string into a readable format.
 * Example: 2026-03-10 -> Mar 10, 2026
 */
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
