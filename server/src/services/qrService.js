import QRCode from "qrcode";
import crypto from "crypto";

/**
 * @desc Generate a signed QR code and security hash for a ticket
 * @param {string} ticketId - The unique ID of the ticket
 * @returns {Object} { qrCodeDataURL, ticketHash }
 */
export const generateTicketInfo = async (ticketId) => {
  try {
    // 1. Create a secure HMAC hash of the ticket ID
    // This prevents people from just making their own QR codes with random IDs
    const ticketHash = crypto
      .createHmac("sha256", process.env.JWT_SECRET)
      .update(ticketId)
      .digest("hex");

    // 2. The data inside the QR code is a URL or JSON string
    // Usually, we point this to our frontend validation page
    const qrData = JSON.stringify({
      id: ticketId,
      hash: ticketHash,
    });

    // 3. Generate the Base64 Data URL for the QR Image
    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      width: 400,
      margin: 2,
    });

    return { qrCodeDataURL, ticketHash };
  } catch (error) {
    console.error("QR Generation Error:", error);
    throw new Error("Failed to generate ticket security data");
  }
};
