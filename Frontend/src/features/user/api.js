import axios from "axios";

// Create Axios instance
const api = axios.create({
  baseURL: "/api/v1", // your backend base URL
  withCredentials: true, // send cookies automatically
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
  },
});

// To avoid multiple refresh calls at the same time
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// Response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Call refresh endpoint
          console.log("Hii");
          const { data } = await api.post("/users/refresh/accessToken");
          const newToken = data?.data?.accessToken;
          if (newToken) {
            // Update default headers with new token
            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
          }

          isRefreshing = false;
          processQueue(null, newToken);

          // Retry original request with new token
          if (newToken) {
            originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          }
          return api(originalRequest);
        } catch (err) {
          isRefreshing = false;
          processQueue(err, null);
          return Promise.reject(err);
        }
      }

      // Queue other failed requests while refresh is in progress
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token) => {
            if (token) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          },
          reject: (err) => reject(err),
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
