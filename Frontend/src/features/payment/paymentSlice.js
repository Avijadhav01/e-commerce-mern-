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

export const processPayment = createAsyncThunk(
  "payment/process",
  async (amount, { rejectWithValue }) => {
    try {
      console.log(amount);
      const { data } = await api.post(`/payments/order`, {
        amount: amount,
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

export const getKey = createAsyncThunk(
  "payment/getkey",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/payments/getKey`);
      // console.log("Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    // paymentOrder: null,
    error: null,
    loading: false,
    // key: null,
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(processPayment.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        // state.paymentOrder = action.payload.data;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.payload ||
          "Failed to process payment";
        // state.paymentOrder = null;
      });

    builder
      .addCase(getKey.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getKey.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        // state.key = action.payload.data;
      })
      .addCase(getKey.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.payload ||
          "Failed to process payment";
        // state.key = null;
      });
  },
});

export const { removeErrors } = paymentSlice.actions;
export default paymentSlice.reducer;
