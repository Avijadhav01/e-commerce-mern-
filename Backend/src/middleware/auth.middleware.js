import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const verifyUserAuth = AsyncHandler(async (req, res, next) => {
  // 1️⃣ Get the token from cookies or header
  const incomingToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!incomingToken) {
    throw new ApiError(
      "User not authorized, Please login to access resource",
      401
    );
  }

  // 2️⃣ Verify the token
  let decodedToken;
  try {
    decodedToken = jwt.verify(incomingToken, process.env.ACCESS_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError("Invalid or expired access token", 401);
  }

  // console.log("Logged in user id was : ", decodedToken);

  // 3️⃣ Find the user in DB
  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError("Invalid access token", 401);
  }

  // 4️⃣ Attach user to request and continue
  req.user = user;
  next();
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      throw new ApiError(
        `Access denied: ${req.user.role} don't have permission to perform this action`,
        403
      );
    }
    next();
  };
};

export { verifyUserAuth, authorizeRoles };
