import { app } from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./db/db.js";
import Razorpay from "razorpay";

if (process.env.NODE_ENV !== "PRODUCTION") {
  dotenv.config({ path: "../.env" });
}
// 🔹 Handle uncaught exceptions (sync code errors)
process.on("uncaughtException", (err) => {
  console.error(`🔥 Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Handle app-level errors
app.on("error", (err) => {
  console.error("❌ APP Error:", err);
  process.exit(1);
});

// console.log(MY_NAME);

// PAYMENT REZORPAY INSTANCE
// console.log(process.env.RAZORPAY_API_KEY);
// console.log(process.env.RAZORPAY_API_SECRET);

export const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const port = process.env.PORT || 2000;
// Connect DB and start server
connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGODB connection FAILED !!!", err);
  });
