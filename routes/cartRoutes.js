import express from "express";
import CartModel from "../models/CartModel.js";
import jwt from "jsonwebtoken";
const router = express.Router();
const JWT_TOKEN = process.env.JWT_TOKEN;
router.post("/add", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "You have no Token!" });
    const token = authHeader.split(" ")[1];
    console.log(token);
    const tokenDecoded = jwt.verify(token, JWT_TOKEN);

    const { item } = req.body;
    const cart = await CartModel.findOne({ userId: tokenDecoded.userId });

    const existing = cart.items.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.items.push({ ...item, quantity: 1 });
    }

    await cart.save();
    res.status(200).json(cart.items);
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
    const cart = await CartModel.findOne({ userId: tokenDecoded.userId });

    const existing = cart.items.find((i) => i.id === itemId);
    if (!existing) return res.status(404).json({ message: "Item not found" });

    if (existing.quantity > 1) {
      existing.quantity -= 1;
    } else {
      cart.items = cart.items.filter((i) => i.id !== itemId);
    }

    await cart.save();
    res.status(200).json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
