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

// Create Order
export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/orders/create", orderData);
      // console.log("Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

// Get user order's
export const getUserOrders = createAsyncThunk(
  "orders/getUserOrders",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/orders/user", {
        params: {
          page: query?.page || 1,
          limit: query?.limit || 5,
        },
      });
      // console.log("Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

// Get single order
export const getSingleOrder = createAsyncThunk(
  "orders/getSingleOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      // console.log("Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    orders: [],
    order: null,

    error: null,
    loading: false,
    success: false,

    currPage: 0,
    isNextPage: false,
    isPrevPage: false,
    totalPages: 0,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    clearOrderSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        const order = action.payload.data;
        state.order = order;
        state.success = true;
        sessionStorage.setItem("order", JSON.stringify(order));
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });

    builder
      .addCase(getUserOrders.pending, (state, action) => {
        state.error = null;
        state.loading = true;
        state.success = false;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;

        const document = action.payload.data;
        state.orders = document.docs;

        // Pagination details
        state.isNextPage = document.hasNextPage;
        state.isPrevPage = document.hasPrevPage;
        state.currPage = document.page;
        state.totalPages = document.totalPages;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      });

    builder
      .addCase(getSingleOrder.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getSingleOrder.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        const order = action.payload.data;
        state.order = order;
      })
      .addCase(getSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.order = null;
      });
  },
});

export const { removeErrors, clearOrderSuccess } = orderSlice.actions;
export default orderSlice.reducer;
