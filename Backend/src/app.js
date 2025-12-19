// server.js or app.js
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";

// Router imports
import productRouter from "./routes/product.routes.js";
import userRouter from "./routes/user.routes.js";
import reviewRouter from "./routes/review.routes.js";
import orderRouter from "./routes/order.routes.js";

const app = express();

// ⚡ Middleware

app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true,
  })
);

// ✅ Parse JSON and URL-encoded payloads
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ⚡ Disable caching for all responses
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// 🧭 Routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);

// ⚠️ 404 handler (unknown routes)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ⚠️ Error middleware (last)
app.use(errorMiddleware);

export { app };
