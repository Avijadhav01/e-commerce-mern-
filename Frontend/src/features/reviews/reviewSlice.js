import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// Create
export const createProductReview = createAsyncThunk(
  "reviews/createProductReview",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/reviews/${formData?.id}`, {
        rating: formData?.rating || 0,
        comment: formData?.comment || "",
      });
      // console.log("Backend Responce", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get All
export const getProductReviews = createAsyncThunk(
  "reviews/getProductReviews",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reviews/${formData.id}`, {
        params: {
          page: formData.page || 1,
          limit: formData.limit || 1,
        },
      });
      // console.log("Backend Responce: ", data);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update
export const deleteReview = createAsyncThunk(
  "reviews/deleteReview",
  async (formData, { rejectWithValue }) => {
    try {
      // console.log(formData);
      const { data } = await api.delete(`/reviews/${formData?.id}`);
      // console.log("Backend Responce", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState: {
    reviews: [],
    loading: false,
    error: null,

    currPage: 0,
    isNextPage: false,
    isPrevPage: false,
    totalPages: 0,

    success: false,
    message: null,
  },
  reducers: {
    removeReviewErrors: (state) => {
      state.error = null;
    },

    removeReviewMessage: (state) => {
      state.message = null;
      state.success = false;
    },

    clearReviewSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getProductReviews.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductReviews.fulfilled, (state, action) => {
        // console.log("fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.reviews = action.payload.docs;
        state.currPage = action.payload.page || 0;
        state.isNextPage = action.payload.hasNextPage || false;
        state.isPrevPage = action.payload.hasPrevPage || false;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(getProductReviews.rejected, (state, action) => {
        console.log("Rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.reviews = [];
      });

    builder
      .addCase(createProductReview.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductReview.fulfilled, (state, action) => {
        // console.log("fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(createProductReview.rejected, (state, action) => {
        // console.log("Rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.success = false;
        state.message = null;
      });

    builder
      .addCase(deleteReview.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        // console.log("fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.success = false;
        state.message = null;
      });
  },
});

export const { removeReviewErrors, removeReviewMessage, clearReviewSuccess } =
  reviewSlice.actions;
export default reviewSlice.reducer;
