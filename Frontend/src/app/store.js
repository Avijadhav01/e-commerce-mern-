import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice";
import reviewReducer from "../features/reviews/reviewSlice";
import userReducer from "../features/user/userSlice";
import cartReducer from "../features/cart/cartSlice";
import paymentReducer from "../features/payment/paymentSlice.js";
import orderReducer from "../features/order/orderSlice.js";
import adminReducer from "../features/Admin/adminSlice.js";

const store = configureStore({
  reducer: {
    product: productReducer,
    review: reviewReducer,
    user: userReducer,
    cart: cartReducer,
    payment: paymentReducer,
    order: orderReducer,
    admin: adminReducer,
  },
});

export { store };
