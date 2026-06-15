import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();
import Stripe from "stripe";
import OrderModel from "../models/Ordermodel.js";
const JWT_TOKEN = process.env.JWT_TOKEN;
const stripe = new Stripe(process.env.STRIPE_KEY);
router.post("/payment-session", express.json(), async (req, res) => {
  try {
     const authHeader = req.headers.authorization;
        if (!authHeader)
          return res.status(401).json({ message: "You have no Token!" });
        const token = authHeader.split(" ")[1];
        const tokenDecoded = jwt.verify(token, JWT_TOKEN);
    const { cartItems, fullAddress } = req.body;
    if (!fullAddress.province || !fullAddress.city || !fullAddress.address) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ error: "Your cart is empty!" });
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cartItems.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: "NEO STEP ORDER",
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.FRONT_END_URL}/orderPlaced`,
      cancel_url: `${process.env.FRONT_END_URL}/`,
      metadata: {
        cartItems: JSON.stringify(cartItems),
        fullAddress: JSON.stringify(fullAddress),
        userId: JSON.stringify(tokenDecoded.userId),
      },
    });
    res.status(200).json({ URL: session.url });
  } catch (err) {
    console.error("Payment error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const stripeSign = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        stripeSign,
        process.env.STRIPE_WEBHOOK,
      );
    } catch (err) {
      console.error("Webhook signature failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        const sessionExist = await OrderModel.findOne({
          stripeSessionId: session.id,
        });
        if (sessionExist) return res.json({ received: true });

        const cartItems = JSON.parse(session.metadata.cartItems);
     
        const fullAddress = JSON.parse(session.metadata.fullAddress);
   
        await OrderModel.create({
          userId,
          cartItems,
          fullAddress,
          stripeSessionId: session.id,
          status: "paid",
        });
      } catch (err) {
        return res.status(500).json({ error: "Order place failed!" });
      }
    }
    return res.json({ received: true });
  },
);
export default router;
