import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Global Error Handling Middleware
const errorMiddleware = (err, req, res, next) => {
  // Default status and message
  let statusCode = Number(err.statusCode) || 500;
  let message = err.message || "Internal Server Error";

  // 🔹 Handle Mongoose Validation Errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = `This ${Object.keys(err.keyValue)} already registered. please login to continue.`;
  }

  // 🔹 Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // 🔹 Optional: Handle custom ApiError
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // 🔹 Log minimal info to console
  console.error(`\n💥Error: ${err.name} | Message: ${message}`);

  // 🔹 Send clean JSON response
  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, null, message));
};

export { errorMiddleware };
