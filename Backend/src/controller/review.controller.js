import mongoose, { isValidObjectId } from "mongoose";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";

// Helper function (recalculate rating + count)
export const updateAverageRatingAndRatingCount = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const total = reviews.length;
  const avg =
    total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;

  await Product.findByIdAndUpdate(
    productId,
    { reviewsCount: total, averageRating: avg },
    { validateBeforeSave: false }
  );
};

// 1️⃣ createReview
const createReview = AsyncHandler(async (req, res) => {
  const productId = req.params?.productId;
  const userId = req.user?._id;

  const { rating, comment } = req.body;
  if (!rating || !comment)
    throw new ApiError("Rating and comment required", 400);

  if (!isValidObjectId(productId))
    throw new ApiError("Invalid product ID", 400);

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  // Check if user already reviewed this product
  const existReview = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (existReview) {
    existReview.rating = Number(rating);
    existReview.comment = comment;
    await existReview.save();
  } else {
    await Review.create({
      product: productId,
      user: userId,
      rating: Number(rating),
      comment,
    });
  }

  await updateAverageRatingAndRatingCount(productId);

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Review created successfully"));
});

// 2️⃣ Get product reviews
const getProductReviews = AsyncHandler(async (req, res) => {
  //
  const productId = req.params.productId;
  const { page = 1, limit = 5 } = req.query;

  if (!isValidObjectId(productId))
    throw new ApiError("Invalid product ID", 400);

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  const aggregate = Review.aggregate([
    {
      $match: { product: new mongoose.Types.ObjectId(productId) },
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    { $unwind: "$userInfo" },
    {
      $project: {
        rating: 1,
        comment: 1,
        createdAt: 1,
        "userInfo.fullName": 1,
        "userInfo.avatar": 1,
        "userInfo._id": 1,
      },
    },
  ]);

  const reviews = await Review.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        reviews,
        reviews.docs.length
          ? "Product reviews fetched successfully"
          : "No review yet"
      )
    );
});

// 4️⃣ Delete Product Review
const deleteProductReview = AsyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;

  if (!isValidObjectId(productId))
    throw new ApiError("Invalid product ID", 400);

  const product = await Product.findById(productId).lean();
  if (!product) throw new ApiError("Product not found", 404);

  const review = await Review.findOne({ product: productId });
  if (!review) throw new ApiError("Review not found", 404);

  if (review.user.toString() !== userId.toString()) {
    throw new ApiError("You are not allowed to delete this review", 403);
  }

  const deletedReview = await Review.findOneAndDelete({
    product: productId,
    user: userId,
  });

  if (!deletedReview)
    throw new ApiError("Review not found or not authorized", 404);

  await updateAverageRatingAndRatingCount(productId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});

// Admin - Delete Review
const adminDeleteReview = AsyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  if (!isValidObjectId(reviewId)) throw new ApiError("Invalid review ID", 400);

  const review = await Review.findById(reviewId);

  if (!review) throw new ApiError("Review not found", 404);

  await Review.findByIdAndDelete(reviewId);
  await updateAverageRatingAndRatingCount(review.product);

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review deleted successfully"));
});

export {
  createReview,
  getProductReviews,
  deleteProductReview,
  adminDeleteReview,
};
