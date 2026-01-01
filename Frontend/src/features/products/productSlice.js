import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// GET ALL PRODUCTS
export const getProducts = createAsyncThunk(
  "products/all",
  async (filter, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products/get-all", {
        params: {
          page: filter?.page || 1,
          limit: filter?.limit || 8,
          keyword: filter?.keyword || "",
          category: filter?.category || "",
        },
      });
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// GET PRODUCT DETAILS
export const getProductDetails = createAsyncThunk(
  "products/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    productCount: 0,
    product: null,

    currPage: 0,
    isNextPage: false,
    isPrevPage: false,
    totalPages: 0,

    loading: false,
    error: null,

    searchKeyword: "", // ✅ initialize
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    setSearchKeyword: (state, action) => {
      state.searchKeyword = action.payload;
    },
    removeSearchKeyword: (state) => {
      state.searchKeyword = "";
    },
  },

  extraReducers: (builder) => {
    // GET ALL PRODUCTS
    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true; // ✅ pending = true
        state.error = null;
        state.products = [];
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.docs || [];
        state.currPage = action.payload.page || 0;
        state.isNextPage = action.payload.hasNextPage || false;
        state.isPrevPage = action.payload.hasPrevPage || false;
        state.totalPages = action.payload.totalPages || 0;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error while getting products";
        state.products = [];
      });

    // GET PRODUCT DETAILS
    builder
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true; // ✅ pending = true
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false; // ✅ fulfilled = false
        state.product = action.payload;
        state.error = null;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error while getting product details";
        state.product = null;
      });
  },
});

export const { removeErrors, setSearchKeyword, removeSearchKeyword } =
  productSlice.actions;
export default productSlice.reducer;
