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

  if (!isValidObjectId(productId)) {
    throw new ApiError("Invalid product ID", 400);
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  // Check if user already reviewed this product
  const existReview = await Review.findOne({
    product: productId,
    user: userId,
  });
  if (existReview) {
    throw new ApiError("You have already reviewed this product", 400);
  }

  const { rating, comment } = req.body;

  if (!rating || !comment)
    throw new ApiError("Rating and comment required", 400);

  const review = await Review.create({
    product: productId,
    user: userId,
    rating: Number(rating),
    comment,
  });

  await updateAverageRatingAndRatingCount(productId);

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review created successfully"));
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

// 3️⃣ Update product reviews
const updateProductReview = AsyncHandler(async (req, res) => {
  //
  const productId = req.params.productId;
  const userId = req.user._id;

  if (!isValidObjectId(productId))
    throw new ApiError("Invalid product ID", 400);

  const product = await Product.findById(productId).lean();

  if (!product) throw new ApiError("Product not found", 404);

  const { rating, comment } = req.body;
  if (!rating || !comment) {
    throw new ApiError("Rating and comment are required", 400);
  }

  const review = await Review.findOne({
    product: productId,
    user: userId,
  });

  if (!review) throw new ApiError("No review yet", 404);

  review.rating = Number(rating);
  review.comment = comment;
  await review.save({ validateBeforeSave: false });

  await updateAverageRatingAndRatingCount(productId);

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Product review updated"));
});

// 4️⃣ Delete Product Review
const deleteProductReview = AsyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const userId = req.user._id;

  if (!isValidObjectId(productId))
    throw new ApiError("Invalid product ID", 400);

  const product = await Product.findById(productId).lean();
  if (!product) throw new ApiError("Product not found", 404);

  const review = await Review.findOne({
    product: productId,
    user: userId,
  });
  if (!review) throw new ApiError("Review not found", 404);

  await Review.findByIdAndDelete(review._id);

  await updateAverageRatingAndRatingCount(productId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Review deleted successfully"));
});

export {
  createReview,
  getProductReviews,
  updateProductReview,
  deleteProductReview,
};
