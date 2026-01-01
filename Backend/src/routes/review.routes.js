import express from "express";
const router = express.Router();

import {
  verifyUserAuth,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

import {
  createReview,
  getProductReviews,
  deleteProductReview,
  adminDeleteReview,
} from "../controller/review.controller.js";

router.route("/:productId").post(verifyUserAuth, createReview);
router.route("/:productId").get(getProductReviews);
router.route("/:productId").delete(verifyUserAuth, deleteProductReview);
router
  .route("/admin/:reviewId")
  .delete(verifyUserAuth, authorizeRoles("admin"), adminDeleteReview);

export default router;
