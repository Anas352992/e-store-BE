import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      id: Number,
      name: String,
      price: Number,
      img: String,
      quantity: Number,
    },
  ],
});

export default mongoose.model("Wishlist", WishlistSchema);
