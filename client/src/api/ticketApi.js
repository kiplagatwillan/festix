// src/api/ticketApi.js
import axiosInstance from "./axiosInstance";

/**
 * Fetch all tickets for the logged-in user
 */
export const getMyTickets = async () => {
  try {
    const { data } = await axiosInstance.get("/tickets/my-tickets");
    return data;
  } catch (err) {
    console.error(
      "Error fetching tickets:",
      err.response?.status,
      err.response?.data,
    );
    // Return empty array to prevent UI crash
    return { tickets: [] };
  }
};

/**
 * Buy a ticket for a given event
 * @param {string} eventId
 * @param {number} quantity
 */
export const buyTicketAPI = async (eventId, quantity = 1) => {
  if (!eventId) throw new Error("Event ID is required to buy ticket");

  try {
    const { data } = await axiosInstance.post("/tickets/purchase", {
      eventId,
      quantity,
    });

    return data;
  } catch (err) {
    console.error(
      "Error buying ticket:",
      err.response?.status,
      err.response?.data || err.message,
    );
    // Re-throw to handle in context or component
    throw err;
  }
};
