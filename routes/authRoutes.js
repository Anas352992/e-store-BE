import jwt from "jsonwebtoken";
import express from "express";
import UserModel from "../models/UserModel.js";
import CartModel from "../models/CartModel.js";
import WishlistModel from "../models/WishlistModel.js";
import rateLimit from "express-rate-limit";
const router = express.Router();
const JWT_TOKEN = process.env.JWT_TOKEN;
const signupLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 5,
  message: { message: "Too many attempts try again after 1 hour!" },
});
const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 60 * 1000,
  max: 5,
  message: { message: "Too many attempts try again after 1 hour!" },
});

router.post("/signup", signupLimiter, async (req, res) => {
  try {
    const { userName, userEmail, userPass } = req.body;

    const existing = await UserModel.findOne({ userEmail });
    if (existing)
      return res.status(400).json({ message: "Email already exists" });

    const user = await UserModel.create({ userName, userEmail, userPass });

    await CartModel.create({ userId: user._id, items: [] });
    await WishlistModel.create({ userId: user._id, items: [] });
    const token = jwt.sign({ userId: user._id }, JWT_TOKEN, {
      expiresIn: "7d",
    });
    res.status(201).json({
      token,
      _id: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      cartItems: [],
      wishlistItems: [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { userEmail, userPass } = req.body;

    const user = await UserModel.findOne({ userEmail, userPass });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const cart = await CartModel.findOne({ userId: user._id });
    const wishlist = await WishlistModel.findOne({ userId: user._id });
    const token = jwt.sign({ userId: user._id }, JWT_TOKEN, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      _id: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      cartItems: cart?.items || [],
      wishlistItems: wishlist?.items || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "You have no Token!" });
    const token = authHeader.split(" ")[1];

    const tokenDecode = jwt.verify(token, JWT_TOKEN);
    const user = await UserModel.findById(tokenDecode.userId);
    if (!user) return res.status(401).json({ message: "User not Found!" });
    const cart = await CartModel.findOne({ userId: user._id });
    const wishlist = await WishlistModel.findOne({ userId: user._id });
    res.status(200).json({
      _id: user._id,
      userName: user.userName,
      userEmail: user.userEmail,
      cartItems: cart?.items || [],
      wishlistItems: wishlist?.items || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
