import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      quantity: Number,
      size: Number,
      variant: { color: String, img: String },
    },
  ],
});

export default mongoose.model("Cart", CartSchema);
