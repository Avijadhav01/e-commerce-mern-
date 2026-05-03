import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";

// Router imports
import productRouter from "./routes/product.routes.js";
import userRouter from "./routes/user.routes.js";
import reviewRouter from "./routes/review.routes.js";
import orderRouter from "./routes/order.routes.js";
import paymentRouter from "./routes/payment.routes.js";

const app = express();

// ================= ENV =================
const isProduction = process.env.NODE_ENV === "production";

// ================= CORS =================
const allowedOrigins = [
  "http://localhost:5173",
  "https://e-commerce-mern-psi.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// ❌ DO NOT ADD app.options("*") → it breaks in latest Express

// ================= MIDDLEWARE =================
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Disable caching
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// ================= ROUTES =================
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payments", paymentRouter);

// ================= 404 =================
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ================= ERROR =================
app.use(errorMiddleware);

// ================= COOKIE OPTIONS =================
export const cookieOptions = {
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days
  httpOnly: true,
  secure: isProduction, // true only in production
  sameSite: isProduction ? "none" : "lax",
};

// ================= EXPORT =================
export { app };
