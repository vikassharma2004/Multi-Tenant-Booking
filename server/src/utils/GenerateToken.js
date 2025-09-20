import jwt from "jsonwebtoken";
import { AppError } from "../middleware/ErrorHandler.js";
import { User } from "../models/User.model.js";
export const generateTokens = async (userId) => {
  // Fetch the user with populated role
  const user = await User.findById(userId).populate("role");
  if (!user) throw new AppError("User not found");
console.log("user",user)
  // Access role and permissions safely
  const payload = {
    id: user._id,
    userType: user.userType,
    role: user.role?.role || null,
    permissions: user.role?.permissions || []
  };

  // Minimal refresh payload
  const refreshPayload = {
    id: user._id,
    userType: user.userType
  };

  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign(refreshPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

  return { accessToken, refreshToken };
};
export const refreshAccessToken = async (refreshToken) => {
  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Fetch user and populate role
    const user = await User.findById(decoded.id).populate("role");
    if (!user) throw new AppError("User not found");

    // Safely access role and permissions
    const roleName = user.role?.role || null;
    const permissions = user.role?.permissions || [];

    // Generate new access token
    const newAccessToken = jwt.sign(
      {
        id: user._id,
        userType: user.userType,
        role: roleName,
        permissions
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    return newAccessToken;
  } catch (err) {
    console.error("Refresh token error:", err.message);
    throw new AppError("Invalid or expired refresh token");
  }
};
export const setAuthCookies = (res, accessToken, refreshToken) => {
  const isProd = process.env.NODE_ENV === "production";

  // Access Token Cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: isProd,
    secure: isProd,                          // only https in production
    sameSite: isProd ? "none" : "lax",       // lax for dev, none for prod (cross-site)
    maxAge: 15 * 60 * 1000,                  // 15 minutes
  });

  // Refresh Token Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: isProd,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,         // 7 days
  });
};
