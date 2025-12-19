import mongoose, { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const reviewSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// ✅ Allow to use aggregatePaginate on Review schema
reviewSchema.plugin(mongooseAggregatePaginate);

// ✅ Prevent duplicate review per product per user
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export const Review = model("Review", reviewSchema);
