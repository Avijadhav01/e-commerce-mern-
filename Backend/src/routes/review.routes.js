import express from "express";
const router = express.Router();

import {
  verifyUserAuth,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

import {
  createReview,
  getProductReviews,
  updateProductReview,
  deleteProductReview,
} from "../controller/review.controller.js";

router.route("/:productId").post(verifyUserAuth, createReview);

router.route("/:productId").get(getProductReviews);

router.route("/:productId").put(verifyUserAuth, updateProductReview);

router.route("/:productId").delete(verifyUserAuth, deleteProductReview);

export default router;
