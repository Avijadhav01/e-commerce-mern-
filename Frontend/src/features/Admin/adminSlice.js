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

// Product Related Work
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/products/admin/create", formData);
      // console.log("Create Backend responce: ", data);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error while creating product"
      );
    }
  }
);

export const fetchAdminProducts = createAsyncThunk(
  "admin/fetchAdminProducts",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/products/admin/getAll", {
        params: {
          page: query?.page || 1,
          limit: query?.limit || 20,
        },
      });
      // console.log("Fetch Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error while fetching products"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ productId, formData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/products/admin/product/${productId}`,
        formData
      );
      // console.log("Update Backend responce: ", data);
      return data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error while updating product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/products/admin/product/${productId}`);
      // console.log("Delete Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error while deleting product"
      );
    }
  }
);

//  User Related work

export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users/admin/fetchAll", {
        params: {
          page: query?.page || 1,
          limit: query?.limit || 20,
        },
      });
      // console.log("Users Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error while fetching users"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/users/admin/user/${userId}`);
      console.log("Delete Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error while deleting user"
      );
    }
  }
);

export const updateRole = createAsyncThunk(
  "admin/updateRole",
  async (updateData, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(
        `/users/admin/user/${updateData?.userId}`,
        {
          role: updateData?.role,
        }
      );
      console.log("Update Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error while updating userRole"
      );
    }
  }
);

// Order Related work
export const fetchOrders = createAsyncThunk(
  "admin/fetchOrders",
  async (query, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/orders/admin/fetchAll", {
        params: {
          page: query?.page || 1,
          limit: query?.limit || 20,
        },
      });
      // console.log("Orders Backend responce: ", data.data.orders);
      return data.data.orders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error while fetching users"
      );
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/orders/admin/${orderId}`);
      console.log("Delete Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error while deleting order"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async (updateData, { rejectWithValue }) => {
    try {
      // console.log(updateData);
      const { data } = await api.patch(`/orders/admin/${updateData?.orderId}`, {
        orderStatus: updateData?.orderStatus,
      });
      // console.log("Update Backend responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Error while updating order Status"
      );
    }
  }
);

export const fetchOrder = createAsyncThunk(
  "orders/fetchOrder",
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

//  Review Related
export const getAdminProductReviews = createAsyncThunk(
  "reviews/getAdminProductReviews",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/reviews/${formData?.productId}`, {
        params: {
          page: formData.page || 1,
          limit: formData.limit || 10,
        },
      });
      // console.log("Backend Responce: ", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const adminDeleteReview = createAsyncThunk(
  "reviews/adminDeleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      // console.log(formData);
      const { data } = await api.delete(`/reviews/admin/${reviewId}`);
      console.log("Backend Responce", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    products: [],
    users: [],
    orders: [],
    order: null,
    reviews: [],

    success: false,
    loading: false,
    error: null,
    message: null,

    currPage: 0,
    isNextPage: false,
    isPrevPage: false,
    totalPages: 0,
  },
  reducers: {
    removeAdminErrors: (state) => {
      state.error = null;
    },
    clearAdminSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },

  extraReducers: (builder) => {
    // 1️⃣Creating Product
    builder
      .addCase(createProduct.pending, (state, action) => {
        state.error = null;
        state.loading = true;
        state.success = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        // Append newly created product to products array
        // if (action.payload) {
        //   state.products.unshift(action.payload).data;
        // }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.success = false;
      });

    // Fetching All Products
    builder
      .addCase(fetchAdminProducts.pending, (state, action) => {
        state.error = null;
        state.loading = true;
        state.success = false;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;

        const document = action.payload.data;

        state.products = document.docs;
        state.isNextPage = document.hasNextPage;
        state.isPrevPage = document.hasPrevPage;
        state.currPage = document.page;
        state.totalPages = document.totalPages;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.success = false;
      });

    // Deleting Product
    builder
      .addCase(deleteProduct.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        // Remove deleted product from products array
        const deletedId = action.meta.arg;
        state.products = state.products.filter((p) => p._id !== deletedId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.success = false;
      });

    // updating Product
    builder
      .addCase(updateProduct.pending, (state, action) => {
        state.error = null;
        state.loading = true;
        state.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.success = false;
      });

    // 2️⃣Fetching All Users
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;

        const document = action.payload.data;

        state.users = document.docs;
        state.isNextPage = document.hasNextPage;
        state.isPrevPage = document.hasPrevPage;
        state.currPage = document.page;
        state.totalPages = document.totalPages;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.success = false;
      });

    // Delete User
    builder
      .addCase(deleteUser.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        // Remove deleted product from products array
        const deletedId = action.meta.arg;
        state.products = state.products.filter((p) => p._id !== deletedId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.success = false;
      });

    // Update Role
    builder
      .addCase(updateRole.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        // update the product in state.products
        const updatedUser = action.payload.data;
        const index = state.users.findIndex((u) => u._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser; // replace old user with updated user
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.success = false;
      });

    // ORDER RELATED
    builder
      .addCase(fetchOrders.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;

        const document = action.payload;
        state.orders = document.docs;
        state.isNextPage = document.hasNextPage;
        state.isPrevPage = document.hasPrevPage;
        state.currPage = document.page;
        state.totalPages = document.totalPages;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.success = false;
      });

    builder
      .addCase(deleteOrder.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        // Remove deleted product from products array
        const deletedId = action.meta.arg;
        state.orders = state.orders.filter((p) => p._id !== deletedId);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.success = false;
      });

    builder
      .addCase(updateOrderStatus.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;
        state.message = action.payload.message;

        // update the product in state.products
        const updatedOrder = action.payload.data;
        const index = state.orders.findIndex((u) => u._id === updatedOrder._id);
        if (index !== -1) {
          state.users[index] = updatedOrder; // replace old user with updated user
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.success = false;
      });

    builder
      .addCase(fetchOrder.pending, (state, action) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.error = null;
        state.loading = false;
        state.success = true;

        state.order = action.payload.data;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
        state.order = null;
        state.success = false;
      });

    // Review Releted
    builder
      .addCase(getAdminProductReviews.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminProductReviews.fulfilled, (state, action) => {
        // console.log("fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.reviews = action.payload.data.docs;

        state.currPage = action.payload.page || 0;
        state.isNextPage = action.payload.hasNextPage || false;
        state.isPrevPage = action.payload.hasPrevPage || false;
        state.totalPages = action.payload.totalPages || 0;
      })
      .addCase(getAdminProductReviews.rejected, (state, action) => {
        // console.log("Rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "Error while fetching product reviews";
        state.reviews = [];
      });

    builder
      .addCase(adminDeleteReview.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeleteReview.fulfilled, (state, action) => {
        // console.log("fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.success = true;
        state.message = action.payload.message;

        // REMOVE deleted review
        if (Array.isArray(state.reviews)) {
          state.reviews = state.reviews.filter(
            (review) => review._id !== action.payload.reviewId
          );
        }
      })
      .addCase(adminDeleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.success = false;
        state.message = null;
      });
  },
});

export const { removeAdminErrors, clearAdminSuccess } = adminSlice.actions;
export default adminSlice.reducer;
