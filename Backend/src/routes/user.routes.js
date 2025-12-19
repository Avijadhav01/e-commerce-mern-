import express from "express";
import { Upload } from "../middleware/multer.middleware.js";

const router = express.Router();

// Routes
import {
  registerUser,
  login,
  logOut,
  deleteUser,
  requestPasswordReset,
  resetPassword,
  getCurrectUser,
  updateUserDetails,
  updateCurrPassword,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  refreshAccessToken,
} from "../controller/user.controller.js";

import {
  authorizeRoles,
  verifyUserAuth,
} from "../middleware/auth.middleware.js";

// Register user
router.route("/register").post(Upload.single("avatar"), registerUser);

// Login user
router.route("/login").post(login);

// Logout user
router.route("/logout").post(verifyUserAuth, logOut);

router.route("/refresh/accessToken").post(refreshAccessToken);

// Request Reset password
router.route("/password/forgot").post(requestPasswordReset);

// Reset Password
router.route("/password/reset/:token").post(resetPassword);

// Get Current User
router.route("/profile").get(verifyUserAuth, getCurrectUser);

// Update user data updateCurrPassword
router
  .route("/profile/update")
  .post(verifyUserAuth, Upload.single("avatar"), updateUserDetails);

router.route("/password/update").post(verifyUserAuth, updateCurrPassword);

// Delete user
router
  .route("/admin/user/:userId")
  .post(verifyUserAuth, authorizeRoles("admin"), deleteUser);

router
  .route("/admin/users")
  .get(verifyUserAuth, authorizeRoles("admin"), getAllUsers);

router
  .route("/admin/user/:userId")
  .get(verifyUserAuth, authorizeRoles("admin"), getSingleUser)
  .put(verifyUserAuth, authorizeRoles("admin"), updateUserRole);

export default router;
