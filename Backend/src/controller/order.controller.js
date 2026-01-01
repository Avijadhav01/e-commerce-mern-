import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";

import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { isValidObjectId } from "mongoose";

const createOrder = AsyncHandler(async (req, res) => {
  const { shippingAddress, orderItems } = req.body;
  const userId = req.user?._id;

  if (!orderItems || orderItems.length === 0)
    throw new ApiError("No order items provided", 400);

  // Fetch all products at once
  const productIds = orderItems.map((item) => item.product);
  const products = await Product.find({ _id: { $in: productIds } });

  let itemsPrice = 0;

  const detailedOrderItems = orderItems.map((item) => {
    const product = products.find((p) => p._id.toString() === item.product);
    if (!product) throw new ApiError(`Product not found: ${item.product}`, 404);
    if (product.stock < item.quantity)
      throw new ApiError(`Not enough stock for ${product.name}`, 400);

    itemsPrice += product.price * item.quantity;

    return {
      product: product._id,
      name: product.name,
      price: product.price,
      avatar: product.productImages[0]?.url || "",
      quantity: item.quantity,
    };
  });

  // Tax and shipping
  const taxPrice = +(itemsPrice * 0.06).toFixed(2);
  const shippingPrice = itemsPrice > 500 ? 0 : 60;
  const totalPrice = itemsPrice + taxPrice + shippingPrice;

  // Create order
  const order = await Order.create({
    user: userId,
    shippingAddress,
    orderItems: detailedOrderItems,
    priceDetails: {
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    },
    isPaid: false,
    paymentInfo: {
      status: "created", // created | paid | failed
    },
    orderStatus: "pending",
  });

  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  // Update stock one by one
  // for (const item of orderItems) {
  //   const product = await Product.findById(item.product);
  //   if (!product) continue; // skip if not found

  //   if (product.stock < item.quantity) {
  //     throw new ApiError(`Not enough stock for ${product.name}`, 400);
  //   }

  //   // Reduce stock
  //   product.stock -= item.quantity;
  //   await product.save({ validateBeforeSave: false });
  // }

  res
    .status(201)
    .json(new ApiResponse(201, order, "Order created successfully"));
});

// All LoggedIn user orders
const allOrdersOfLoggedInUser = AsyncHandler(async (req, res) => {
  //
  const userId = req.user._id;
  const { page = 1, limit = 5 } = req.query;

  const aggregate = Order.aggregate([
    { $match: { user: userId } },
    { $sort: { createdAt: -1 } },
  ]);

  const orders = await Order.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });
  if (!orders.docs.length) {
    return res.status(200).json(new ApiResponse(404, {}, "Orders Not Found"));
  }
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders fetched successfully"));
});

// Admin -- Getting single order
const getSingleOrder = AsyncHandler(async (req, res) => {
  const orderId = req.params.orderId;

  if (!isValidObjectId(orderId)) {
    throw new ApiError("Invalid Order ID", 400);
  }

  const order = await Order.findById(orderId).populate(
    "user",
    "fullName email"
  );
  if (!order) {
    throw new ApiError("Order not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order fetched successfully"));
});

// Admin -- getting all orders
const allOrders = AsyncHandler(async (req, res) => {
  //
  const { page = 1, limit = 5 } = req.query;

  const aggregate = Order.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true },
    },
    { $sort: { createdAt: -1 } },
    {
      $project: {
        // include all order fields
        _id: 1,
        shippingAddress: 1,
        orderItems: 1,
        paymentInfo: 1,
        paidAt: 1,
        priceDetails: 1,
        orderStatus: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,

        // replace userInfo with only selected fields
        userInfo: {
          _id: 1,
          fullName: 1,
          email: 1,
          avatar: 1,
        },
      },
    },
  ]);

  const orders = await Order.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "All orders fetched successfully"));
});

// Restore stock helper function
const restoreStock = async (orderItems) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) continue;

    product.stock += item.quantity;
    await product.save({ validateBeforeSave: false });
  }
};

// Admin -- Update Order Status
const updateOrderStatus = AsyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  if (!isValidObjectId(orderId)) throw new ApiError("Invalid order ID", 400);

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError("Order not found", 404);

  const { orderStatus } = req.body;
  const allowedStatuses = [
    "pending",
    "processing",
    "packed",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  if (!allowedStatuses.includes(orderStatus)) {
    throw new ApiError("Invalid order status", 400);
  }

  // Prevent updating already finalized orders
  if (["delivered", "cancelled", "refunded"].includes(order.orderStatus)) {
    throw new ApiError("Order status cannot be updated", 400);
  }

  order.orderStatus = orderStatus;

  if (orderStatus === "delivered") {
    order.deliveredAt = Date.now();
  }

  if (["cancelled", "refunded"].includes(orderStatus)) {
    await restoreStock(order.orderItems);
  }

  await order.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order status updated successfully"));
});

// Admin -- delete Order
const deleteOrder = AsyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  if (!isValidObjectId(orderId)) throw new ApiError("Invalid order ID", 400);

  const order = await Order.findById(orderId);
  if (!order) throw new ApiError("Order not found", 404);

  // Only allow deletion if order is delivered, cancelled, or refunded
  if (
    !["pending", "delivered", "cancelled", "refunded"].includes(
      order.orderStatus
    )
  ) {
    throw new ApiError(
      "Only pending, delivered, cancelled, or refunded orders can be deleted",
      400
    );
  }

  await order.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Order deleted successfully"));
});

export {
  createOrder,
  getSingleOrder,
  allOrders,
  allOrdersOfLoggedInUser,
  updateOrderStatus,
  deleteOrder,
};
