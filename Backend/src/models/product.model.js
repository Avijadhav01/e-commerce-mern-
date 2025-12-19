import mongoose, { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import slugify from "slugify";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "Generic",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      max: 9999999,
      index: true,
    },

    productImages: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
        resource_type: {
          type: String,
          enum: ["image", "video"],
          default: "image",
        },
      },
    ],

    category: {
      type: String,
      required: true,
      enum: ["Electronics", "Clothes", "Shoes", "Sports", "Vehicle", "Other"],
      index: true,
    },

    tags: [{ type: String, index: true }],

    stock: {
      type: Number,
      default: 1,
      min: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviewsCount: {
      type: Number,
      default: 0,
    },

    owner: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// 🔥 Auto-create slug from name
productSchema.pre("save", async function (next) {
  if (!this.isModified("name")) return next();

  let baseSlug = slugify(this.name, { lower: true });
  let slug = baseSlug;
  let count = 1;

  // Check if slug already exists
  while (await Product.exists({ slug })) {
    slug = `${baseSlug}-${count}`;
    count++;
  }

  this.slug = slug;
  next();
});

// 🔥 Indexing for full-text search
productSchema.index({
  name: "text",
  description: "text",
  brand: "text",
  category: "text",
});

productSchema.plugin(mongooseAggregatePaginate);

export const Product = model("Product", productSchema);
