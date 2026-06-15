import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import Orderroutes from "./routes/Orderroutes.js";
import Paymentsession from "./routes/Stripe.js";
const app = express();

app.set("trust proxy", 1);
app.use(
  cors({
    origin: "https://e-store-fe.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("/api/payments", Paymentsession);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("Connection error:", err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/order", Orderroutes);
if (process.env.NODE_ENV !== "production") {
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
  });
}
export default app;
