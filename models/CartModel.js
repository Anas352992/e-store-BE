import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      id: Number,
      name: String,
      price: String,
      img: String,
      quantity: Number,
    },
  ],
});

export default mongoose.model("Cart", CartSchema);
