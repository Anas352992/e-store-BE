import express from "express";
import jwt from "jsonwebtoken";
import OrderModel from "../models/Ordermodel.js";

const router = express.Router();
const JWT_TOKEN = process.env.JWT_TOKEN;

router.post("/place", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "You have no Token!" });

    const token = authHeader.split(" ")[1];
    const tokenDecoded = jwt.verify(token, JWT_TOKEN);

    const { items, province, city, address } = req.body;

    if (!items || !province || !city || !address) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newOrder = new OrderModel({
      userId: tokenDecoded.userId,
      items,
      province,
      city,
      address,
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order placed successfully!", order: newOrder });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
