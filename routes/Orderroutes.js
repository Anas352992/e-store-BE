import express from "express";
import jwt from "jsonwebtoken";
import OrderModel from "../models/Ordermodel.js";

const router = express.Router();
const JWT_TOKEN = process.env.JWT_TOKEN;

router.get("/getOrders", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "You have no Token!" });

    const token = authHeader.split(" ")[1];
    const tokenDecoded = jwt.verify(token, JWT_TOKEN);
    const Orders = await OrderModel.find({ userId: tokenDecoded.userId });
    if (!Orders) return;
    res
      .status(201)
      .json( Orders );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
