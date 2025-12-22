import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const orderSchema = new mongoose.Schema(
  {
    shippingAddress: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
    },

    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true, // optional: if you want to cache product name at order time
        },
        price: {
          type: Number,
          required: true, // optional: cache price at order time
        },
        avatar: {
          type: String, // URL of product image
          required: false, // optional
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],

    paymentInfo: {
      id: String, // Razorpay payment_id
      status: String, // created | paid | failed
    },

    priceDetails: {
      itemsPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      taxPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      shippingPrice: {
        type: Number,
        required: true,
        default: 0,
      },
      totalPrice: {
        type: Number,
        required: true,
        default: 0,
      },
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },

    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

orderSchema.plugin(mongooseAggregatePaginate);

export const Order = mongoose.model("Order", orderSchema);
