import express from "express";
import WishlistModel from "../models/WishlistModel.js";
import jwt from "jsonwebtoken";
const router = express.Router();
const JWT_TOKEN = process.env.JWT_TOKEN;
router.post("/add", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "You have no Token!" });
    const token = authHeader.split(" ")[1];

    const tokenDecoded = jwt.verify(token, JWT_TOKEN);
    const { item } = req.body;
    const wishlist = await WishlistModel.findOne({
      userId: tokenDecoded.userId,
    });

    const existing = wishlist.items.find((i) => i.id === item.id);
    if (!existing) {
      wishlist.items.push(item);
      await wishlist.save();
    }

    res.status(200).json(wishlist.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/remove", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "You have no Token!" });
    const token = authHeader.split(" ")[1];

    const tokenDecoded = jwt.verify(token, JWT_TOKEN);
    const { itemId } = req.body;
    const wishlist = await WishlistModel.findOne({
      userId: tokenDecoded.userId,
    });

    wishlist.items = wishlist.items.filter((i) => i.id !== itemId);
    await wishlist.save();

    res.status(200).json(wishlist.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
