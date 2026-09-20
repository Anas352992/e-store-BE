
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const ConnectionInstance = await mongoose.connect(process.env.MONGO_URI, {
      family: 4, // Forces IPv4 to bypass the DNS error
    });
    console.log("✅ MongoDB Connected Successfully!");
    console.log(ConnectionInstance)
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // Stop the app if it can't connect
  }
}
export default connectDB