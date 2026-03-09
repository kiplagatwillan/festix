import axiosInstance from "./axiosInstance";

/**
 * @desc Initiates the Stripe Checkout flow for a specific event
 * @param {string} eventId - The ID of the event to purchase
 * @returns {Promise<Object>} Contains the Stripe checkout URL
 */
export const createCheckoutSession = async (eventId) => {
  const { data } = await axiosInstance.post("/payments/create-session", {
    eventId,
  });
  return data;
};
