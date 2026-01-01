import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "./api.js";
import axios from "axios";

// Create Axios instance
// const api = axios.create({
//   baseURL: "/api/v1", // your backend base URL
//   withCredentials: true, // send cookies automatically
//   headers: {
//     "Cache-Control": "no-cache",
//     Pragma: "no-cache",
//   },
//   credentials: "include", // send cookies
// });
// Register User
export const registerUser = createAsyncThunk(
  "registerUser",
  async (fd, { rejectWithValue }) => {
    try {
      console.log(fd);
      const response = await api.post("/users/register", fd);

      // console.log("Backend Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logInUser = createAsyncThunk(
  "logInUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", formData);
      // console.log("Backend Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const loadUser = createAsyncThunk(
  "users/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/profile");
      // console.log("Backend Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/logout");
      // console.log("Backend Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update
export const updateProfile = createAsyncThunk(
  "updateProfile",
  async (fd, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/profile/update", fd);
      console.log("Backend Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updatePassword = createAsyncThunk(
  "updatePassword",
  async (object, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/password/update", object);
      console.log("Backend Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/password/forgot", email);
      // console.log("Backend Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/users/password/reset/${formData.token}`,
        {
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }
      );
      // console.log("Backend Response:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",

  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null,
    loading: false, // <---- IMPORTANT
    error: null,
    isAuthenticated: !!localStorage.getItem("user"),
    successMessage: "",
  },

  reducers: {
    removeErrors: (state) => {
      state.error = null;
    },

    clearSuccess(state) {
      state.successMessage = "";
    },
  },

  extraReducers: (builder) => {
    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.user = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // console.log("Fulfilled action payload: ", action.payload);
        state.user = action.payload.data;
      })
      .addCase(registerUser.rejected, (state, action) => {
        console.log("Register rejected action payload: ", action.payload);
        state.loading = false;
        state.error =
          action.payload || "Registeration failed. Please try again later";
        state.user = null;
      });

    // Login
    builder
      .addCase(logInUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        // console.log("Fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(logInUser.rejected, (state, action) => {
        console.log("Login rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "Login failed. Pleasr try again later";
        state.user = null;
        state.isAuthenticated = false;
      });

    // Current user
    builder
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        // console.log("Fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.user = action.payload.data;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(loadUser.rejected, (state, action) => {
        // console.log("Current user rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "Failed to load user";
        state.user = null;
        localStorage.removeItem("user");
        state.isAuthenticated = false;
        // DO NOT set user to null here
      });

    // Log-Out
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        // console.log("Fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("user");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        // console.log("Rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "LogOut failed";
        // state.isAuthenticated = true;
      });

    // Update profile

    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        // console.log("Fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        // console.log("update data Rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "Update profile failed";
      });

    // Update password
    builder
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state, action) => {
        // console.log("Fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        // console.log("updatedata Rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "Update password failed";
      });

    // Forgot password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        // console.log("Fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        // console.log("forgot Rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "Email send fail";
        state.successMessage = "";
      });

    // Reset password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        // console.log("Fulfilled action payload: ", action.payload);
        state.loading = false;
        state.error = null;
        state.successMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        // console.log("forgot Rejected action payload: ", action.payload);
        state.loading = false;
        state.error = action.payload || "Password reset failed";
        state.successMessage = "";
      });
  },
});

export const { removeErrors, clearSuccess } = userSlice.actions;
export default userSlice.reducer;
