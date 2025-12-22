import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

export const getProducts = createAsyncThunk(
  "products/all",
  async (filter, { rejectWithValue }) => {
    try {
      // console.log(filter);
      const { data } = await api.get("/products/get-all", {
        params: {
          page: filter?.page || 1,
          limit: filter?.limit || 8,
          keyword: filter?.keyword,
          category: filter?.category,
        },
      });
      // console.log("Backend Response:", data);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProductDetails = createAsyncThunk(
  "products/getProductDetails",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${id}`);
      // console.log("hii: ", data);
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
    searchKeyword: "",

    currPage: 0,
    isNextPage: false,
    isPrevPage: false,
    totalPages: 0,

    loading: false,
    error: null,
  },
  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },
    setSearchKeyword: (state, action) => {
      // console.log("Searched : ", action.payload);
      state.searchKeyword = action.payload;
    },
    unSetSearchKeyword: (state) => {
      state.searchKeyword = "";
    },
  },

  extraReducers: (builder) => {
    // Get Products
    builder
      .addCase(getProducts.pending, (state, action) => {
        state.products = []; // reset product list
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.products = action.payload.docs || [];
        state.currPage = action.payload.page || 0;
        state.isNextPage = action.payload.hasNextPage || false;
        state.isPrevPage = action.payload.hasPrevPage || false;
        state.totalPages = action.payload.totalPages || 0;
        state.loading = false;
        state.error = null;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        // console.log("Rejected action payload: ", action.payload);
        state.error = action.payload || "Error while getting products";
      });

    // get product
    builder
      .addCase(getProductDetails.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.product = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        console.log("Rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "Error while getting product details";
        state.product = null;
      });
  },
});

export const { removeErrors, setSearchKeyword, unSetSearchKeyword } =
  productSlice.actions;
export default productSlice.reducer;
