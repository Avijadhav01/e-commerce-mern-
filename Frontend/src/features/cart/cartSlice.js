import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // ✔ MUST be here
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// Add items to cart
export const addItemToCart = createAsyncThunk(
  "cart/addItemToCart",
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      // console.log("Backend responce: ", data);
      return {
        productId: data.data._id,
        name: data.data.name,
        price: data.data.price,
        image: data.data.productImages[0].url,
        stock: data.data.stock,
        quantity,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: JSON.parse(localStorage.getItem("cartItems")) || [],
    loading: false,
    error: null,
    success: false,
    message: null,
    shippingInfo: JSON.parse(localStorage.getItem("shippingInfo")) || {},
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },

    removeMessage: (state) => {
      state.message = null;
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => {
        return item.productId !== action.payload.productId;
      });
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    editItemInCart: (state, action) => {
      const item = state.cartItems.find(
        (item) => item.productId === action.payload.productId
      );

      if (item) item.quantity = action.payload.quantity;
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    saveShippingInfo: (state, action) => {
      state.shippingInfo = action.payload;
      localStorage.setItem("shippingInfo", JSON.stringify(state.shippingInfo));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addItemToCart.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
        const newItem = action.payload;

        const existingItem = state.cartItems.find(
          (i) => i.productId === newItem.productId
        );
        if (existingItem) {
          existingItem.quantity = Math.min(
            existingItem.quantity + newItem.quantity,
            newItem.stock
          );
          state.message = `${action.payload.name} quantity updated in cart !`;
        } else {
          state.cartItems.push(action.payload);
          state.message = `${action.payload.name} is added to cart successfully !`;
        }
        localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.payload ||
          "Failed to fetch product";
      });
  },
});

export const {
  removeErrors,
  removeMessage,
  removeFromCart,
  editItemInCart,
  saveShippingInfo,
} = cartSlice.actions;
export default cartSlice.reducer;
