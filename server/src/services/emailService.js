import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendTicketConfirmation = async (email, ticketDetails) => {
  const mailOptions = {
    from: `"Festix Global" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `🎟️ Your Ticket: ${ticketDetails.eventName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px;">
        <h2 style="color: #6366f1;">Thank you for your purchase!</h2>
        <p>You're going to <strong>${ticketDetails.eventName}</strong>.</p>
        <hr />
        <div style="text-align: center; margin: 20px 0;">
          <img src="${ticketDetails.qrCode}" alt="QR Code" style="width: 200px; height: 200px;" />
          <p style="font-size: 12px; color: #666;">Scan this QR at the venue entrance</p>
        </div>
        <p><strong>Date:</strong> ${new Date(ticketDetails.eventDate).toLocaleDateString()}</p>
        <p><strong>Venue:</strong> ${ticketDetails.venue}</p>
        <hr />
        <p style="font-size: 11px; color: #999;">If you didn't make this purchase, contact support immediately.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email Dispatch Error:", error);
    // In production, you might log this to a "FailedEmails" table for retry
  }
};
