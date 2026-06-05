import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        id: Number,
        name: String,
        price: String,
        img: String,
        quantity: Number,
      },
    ],
    province: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model("Order", OrderSchema);
