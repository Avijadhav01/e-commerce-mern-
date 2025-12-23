import express from "express";
const router = express.Router();

import {
  verifyUserAuth,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

import {
  createOrder,
  getSingleOrder,
  allOrders,
  allOrdersOfLoggedInUser,
  updateOrderStatus,
  deleteOrder,
} from "../controller/order.controller.js";

// User routes
router.route("/create").post(verifyUserAuth, createOrder);
router.route("/user").get(verifyUserAuth, allOrdersOfLoggedInUser);

// Admin routes
router
  .route("/admin/orders")
  .get(verifyUserAuth, authorizeRoles("admin"), allOrders);

router
  .route("/admin/update-status/:orderId")
  .put(verifyUserAuth, authorizeRoles("admin"), updateOrderStatus);

router
  .route("/admin/:orderId")
  .delete(verifyUserAuth, authorizeRoles("admin"), deleteOrder);

router
  .route("/:orderId") // add "order" to avoid conflict with "update-status"
  .get(verifyUserAuth, getSingleOrder);

export default router;
