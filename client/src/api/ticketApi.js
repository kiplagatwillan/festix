import axiosInstance from "./axiosInstance";

/**
 * @desc Fetch all tickets belonging to the currently authenticated user
 * @returns {Promise<Array>} List of tickets with event details
 */
export const getMyTickets = async () => {
  const { data } = await axiosInstance.get("/tickets/my-tickets");
  return data;
};

/**
 * @desc Fetch details for a specific ticket including QR data
 * @param {string} id - The Ticket ID
 * @returns {Promise<Object>} Detailed ticket object
 */
export const getTicketDetails = async (id) => {
  const { data } = await axiosInstance.get(`/tickets/${id}`);
  return data;
};
