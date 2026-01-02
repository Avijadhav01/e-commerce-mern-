import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import crypto from "crypto";

import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { instance } from "../server.js";

const processPayment = AsyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount) throw new ApiError("Amount is required", 400);

  const amountInPaise = Math.round(Number(amount) * 100);
  console.log(amountInPaise);

  const options = {
    amount: amountInPaise,
    currency: "INR",
  };

  const order = await instance.orders.create(options);
  if (!order) {
    throw new ApiError("Failed to create payment order", 400);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Payment order created successfully"));
});

const sendApiKey = AsyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        process.env.RAZORPAY_API_KEY,
        "Key fetched successfully"
      )
    );
});

// Payment verification
const paymentVerification = AsyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const orderId = req.query.orderId; // <- get orderId from query params

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (!isAuthentic) {
    // Redirect to payment page with failure alert

    order.orderStatus = "Cancelled";
    order.isPaid = false;
    order.paymentInfo = {
      status: "Failed",
    };

    return res.redirect(
      `http://localhost:5173/order/payment?status=failed&orderId=${orderId}`
    );
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  // Update order status
  order.paymentInfo = {
    id: razorpay_payment_id,
    status: "Paid",
  };
  order.orderStatus = "Processing";
  order.isPaid = true;
  order.paidAt = Date.now();
  await order.save();

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);
    if (!product) continue; // skip if product not found

    // Reduce stock
    product.stock -= item.quantity;

    // Save changes
    await product.save({ validateBeforeSave: false });
  }

  // Redirect to success page
  return res.redirect(
    `http://localhost:5173/payment-success?reference=${razorpay_payment_id}`
  );
});

export { processPayment, sendApiKey, paymentVerification };
