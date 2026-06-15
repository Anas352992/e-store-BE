import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
     userId: { type: String, required: true },
    cartItems: [
     {
      id: Number,
      name: String,
      price: Number,
      quantity: Number,
      size: Number,
      variant: { color: String, img: String },
    },
    ],
    fullAddress: {
      province: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    stripeSessionId: { type: String, unique: true },
    status: String,
  },
  { timestamps: true },
);

export default mongoose.model("Order", OrderSchema);
