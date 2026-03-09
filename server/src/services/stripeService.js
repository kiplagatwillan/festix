import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * @desc    Creates a high-performance Checkout Session
 * @param   {Object} event - The Prisma event object
 * @param   {Object} user - The logged-in user object
 */
export const createCheckoutSession = async (event, user) => {
  try {
    return await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: event.title,
              description: `Location: ${event.venue} | Category: ${event.category}`,
              images: event.imageUrl ? [event.imageUrl] : [],
            },
            unit_amount: Math.round(event.price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/events/${event.id}`,
      customer_email: user.email,
      metadata: {
        eventId: event.id,
        userId: user.id,
      },
    });
  } catch (error) {
    throw new Error(`Stripe Session Error: ${error.message}`);
  }
};

export default stripe;
