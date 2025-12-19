import { AsyncHandler } from "../utils/AsyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import {
  uploadOnCloudinary,
  deleteImagesFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import { sendEmail } from "../utils/sendEmail.js";
import { isValidObjectId } from "mongoose";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const options = {
  maxAge: 3 * 24 * 60 * 60 * 1000, // 3 days in milliseconds
  httpOnly: true,
  // secure: true,
};

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false }); // “Just save the changes, don’t run full validation on every field.”

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Token generation error:", error);
    throw new ApiError("Error while generating tokens", 500);
  }
};

const registerUser = AsyncHandler(async (req, res) => {
  // 1️⃣ Destructure fields
  const {
    fullName,
    email,
    password,
    role = "user",
    phone = "0000 000 000",
  } = req.body;

  const avatarLocalPath = req.file?.path;

  const requiredFields = ["fullName", "email", "password"];

  // 2️⃣ Validate required fields
  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].trim() === "") {
      return res
        .status(400)
        .json(new ApiResponse(400, [], `Please provide ${field}`));
    }
  }

  if (!avatarLocalPath) throw new ApiError(400, "Avatar is required");

  // 4️⃣ Upload images to Cloudinary and check avatar response
  const avatarResponse = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarResponse) {
    throw new ApiError("Failed to upload avatar on Cloudinary", 400);
  }

  //3️⃣ Check if user already exists (email or username)
  const existingUser = await User.findOne({
    email,
  });

  if (existingUser) {
    await deleteImagesFromCloudinary([avatarResponse.public_id]);
    throw new ApiError("User with this email already exists", 400);
  }

  const avatar = {
    url: avatarResponse.url,
    public_id: avatarResponse.public_id,
  };

  // 5️⃣ Create new user
  const user = await User.create({
    fullName,
    email: email.toLowerCase(),
    password,
    avatar,
    role,
    phone,
  });

  const publicIds = [avatar.public_id];

  if (!user) {
    await deleteImagesFromCloudinary(publicIds);
    throw new ApiError("User not found", 404);
  }

  // 6️⃣ Exclude password field before sending response
  const updatedUser = await User.findById(user._id).select("-password");

  // 7️⃣ Send success response
  return res
    .status(201)
    .json(new ApiResponse(201, updatedUser, "User registered successfully"));
});

const login = AsyncHandler(async (req, res) => {
  //
  const { email, password } = req.body;
  if (!email || validator.isEmpty(email) || !validator.isEmail(email)) {
    throw new ApiError("Please provide a valid email", 400);
  }

  if (!password.trim()) {
    throw new ApiError("Please provide password", 400);
  }

  const user = await User.findOne({
    email,
  }).select("+password");

  if (!user) {
    throw new ApiError("Please provide valid credentials", 400);
  }

  const isPassMatch = await user.isPasswordCorrect(password);

  if (!isPassMatch) {
    throw new ApiError("Please provide valid credentials", 400);
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  console.log(`\n${loggedInUser.fullName} logged in successfully !`);

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully"));
});

const logOut = AsyncHandler(async (req, res) => {
  // 1️⃣ Invalidate refresh token in DB (if stored)
  const userId = req.user?._id;
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user ID", 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  console.log("\nUser logged out successfully !");

  // 2️⃣ Clear cookies and send response
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Request Reset password
const requestPasswordReset = AsyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // 1️⃣ Validate email
  if (!email || !validator.isEmail(email)) {
    throw new ApiError("Email is invalid", 400);
  }

  // 2️⃣ Check if user exists
  const user = await User.findOne({ email });
  if (!user) throw new ApiError("User with this email is not exist", 404);

  // 3️⃣ Generate reset token
  let resetToken;
  try {
    resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    console.error("Error: ", error.message);
    throw new ApiError("Error while generating password reset token", 500);
  }

  // 4️⃣ Create reset link
  const resetPasswordURL = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `
    Reset your password using this link:
    ${resetPasswordURL}

    This link will expire in 30 minutes.
    If you did not request this, please ignore it.
  `;

  // 5️⃣ Send email
  try {
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      message,
    });

    // 6️⃣ Send response
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {},
          "If this email exists, a password reset link has been sent"
        )
      );
  } catch (error) {
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;
    await user.save({ validateBeforeSave: false });

    console.error("Error: ", error);
    throw new ApiError(
      "ResetPassword Error: Email couldn't be sent, please try again later",
      500
    );
  }
});

// Reset the password
const resetPassword = AsyncHandler(async (req, res) => {
  const resetToken = req.params?.token;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Fetch user including password for update
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  }).select("+password"); // include password only for updating

  if (!user) {
    throw new ApiError(
      "Reset password token is invalid or has been expired",
      400
    );
  }

  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    throw new ApiError("Confirm password does not match", 400);
  }

  // Update password and remove reset token info
  user.password = password;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;

  await user.save({ validateBeforeSave: false });

  // Fetch user again WITHOUT password for sending response
  const userResponse = await User.findById(user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, userResponse, "Password reset successfully"));
});

const getCurrectUser = AsyncHandler(async (req, res) => {
  //

  const userId = req.user?._id;
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user ID", 400);
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Currect user fetched successfully"));
});

// Update Account details
const updateUserDetails = AsyncHandler(async (req, res) => {
  //
  const userId = req.user?.id; // logged-in user ID

  const allowedFields = ["fullName", "email", "phone", "avatar"];
  const avatarLocalPath = req.file?.path;

  let dataToBeUpdate = {};

  // pick only allowed fields from request body
  for (let key of allowedFields) {
    if (req.body[key] !== undefined && req.body[key] !== null) {
      dataToBeUpdate[key] = req.body[key];
    }
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found", 404);

  const oldAvatarPublic_Id = user.avatar?.public_id;

  let avatarResponse;
  if (avatarLocalPath) {
    avatarResponse = await uploadOnCloudinary(avatarLocalPath);
    dataToBeUpdate.avatar = {
      url: avatarResponse?.url || avatarResponse.secure_url,
      public_id: avatarResponse.public_id,
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: dataToBeUpdate },
    { new: true, runValidators: true }
  );

  if (!updatedUser) {
    await deleteImagesFromCloudinary([avatarResponse.public_id]);
  }

  if (dataToBeUpdate.avatar && oldAvatarPublic_Id) {
    await deleteImagesFromCloudinary([oldAvatarPublic_Id]);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "User updated successfully"));
});

const updateCurrPassword = AsyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { oldPassword, newPassword, confirmPassword } = req.body;

  // 1️⃣ Check required fields
  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new ApiError("All fields are required.", 400);
  }

  // 2️⃣ Get the logged-in user
  const user = await User.findById(userId).select("+password");
  if (!user) {
    throw new ApiError("User not found", 400);
  }

  // 3️⃣ Compare old password
  const isMatch = await user.isPasswordCorrect(oldPassword);
  if (!isMatch) {
    throw new ApiError("Old password is incorrect.", 400);
  }

  // 4️⃣ Check new & confirm password match
  if (newPassword !== confirmPassword) {
    throw new ApiError(
      "ConfirmPassword does not matched with newPassword.",
      400
    );
  }

  // 5️⃣ Optional: prevent using same password again
  if (await user.isPasswordCorrect(newPassword)) {
    throw new ApiError(
      "New password must be different from the old password.",
      400
    );
  }

  // Save new password (hashes automatically)
  user.password = newPassword;
  await user.save({ validateBeforeSave: true });

  // 7️⃣ Final response
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password updated successfully."));
});

// ========= Admin Functionality =======

// 1️⃣0️⃣ Admin - delete user account
const deleteUser = AsyncHandler(async (req, res) => {
  const userId = req.params?.userId;

  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user ID", 400);
  }

  // Delete the user from DB
  const user = await User.findByIdAndDelete(userId).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // Delete avatar from Cloudinary (if exists)
  if (user.avatar?.public_id) {
    try {
      await deleteImagesFromCloudinary([user.avatar.public_id]);
    } catch (error) {
      console.error("Error deleting avatar:", error.message);
    }
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

// 1️⃣1️⃣ Admin - getting all users
const getAllUsers = AsyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  // Create aggregation pipeline
  const aggregate = User.aggregate([
    {
      $match: {
        role: { $in: ["admin", "user"] },
      },
    },
    {
      $project: {
        password: 0,
        refreshToken: 0,
      },
    },
  ]);

  const users = await User.aggregatePaginate(aggregate, {
    page: Number(page),
    limit: Number(limit),
  });

  if (!users || !users.docs.length) {
    throw new ApiError("User's not available", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, users, "All user's fetched successfully"));
});

// 1️⃣2️⃣ Admin - getting single user information
const getSingleUser = AsyncHandler(async (req, res) => {
  const userId = req.params.userId;
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user ID", 400);
  }

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User fetched successfully"));
});

// 1️⃣3️⃣ Admin - change user role
const updateUserRole = AsyncHandler(async (req, res) => {
  const userId = req.params?.userId;

  // 1️⃣ Validate user ID
  if (!isValidObjectId(userId)) {
    throw new ApiError("Invalid user ID", 400);
  }

  // 2️⃣ Check if user exists
  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError("User not found", 404);
  }

  // 3️⃣ Get role from body
  const { role } = req.body;

  // 4️⃣ Validate role
  if (!role) {
    throw new ApiError("Please select a role (user or admin)", 400);
  }

  if (!["user", "admin"].includes(role)) {
    throw new ApiError("Invalid role. Allowed roles: user, admin", 400);
  }

  // 5️⃣ Update role
  user.role = role;
  await user.save({ validateBeforeSave: false });

  // 6️⃣ Response
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Role updated successfully"));
});

// ----------------- REFRESH TOKEN -----------------
const refreshAccessToken = AsyncHandler(async (req, res) => {
  // Get the JWT string you got from the client.

  const incomingRefreshToken =
    req.cookies.refreshToken ||
    req.body.refreshToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!incomingRefreshToken) {
    throw new ApiError("Unauthorized request", 401);
  }

  try {
    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET; // This is what the server uses to recreate the signature.

    const decodedToken = jwt.verify(incomingRefreshToken, refreshTokenSecret); //Token + Secret together → allows the server to check the signature and decode the payload.

    if (!decodedToken || !decodedToken._id) {
      throw new ApiError("Invalid Refresh Token", 401);
    }

    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (user.refreshToken !== incomingRefreshToken) {
      throw new ApiError("Token mismatched or expired", 401);
    }

    const { accessToken, refreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    console.error("Error: ", error);
    throw new ApiError("Could not refresh access token", 500);
  }
});

export {
  registerUser,
  login,
  refreshAccessToken,
  logOut,
  requestPasswordReset,
  resetPassword,
  getCurrectUser,
  updateUserDetails,
  updateCurrPassword,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
};
