import jwt from "jsonwebtoken";
import { AppError } from "./ErrorHandler.js";
import { User } from "../models/User.model.js";


export const isAuthenticated = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ Fallback to cookies
    if (!token && req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return next(new AppError("unauthorized access", 401));
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Fetch user from DB
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(new AppError("Unauthorized: User not found", 401));
    }

    if (user.isDeleted) {
      return next(new AppError("Unauthorized: User account is deleted", 403));
    }

    // 5️⃣ Attach user to request
    req.user = user;

    next();
  } catch (err) {
    return next(new AppError("Unauthorized: Invalid or expired token", 401));
  }
};

export const isLoggedIn = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return next(new AppError("Not logged in", 401));
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new AppError("User not found", 401));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError("Invalid refresh token", 401));
  }
};