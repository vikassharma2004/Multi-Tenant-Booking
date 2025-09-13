import jwt from "jsonwebtoken";
import { AppError } from "../middleware/ErrorHandler.js";
export const generateTokens = (id, role) => {
    const payload = { id, role };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "15m", // short-lived
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d", // long-lived
    });

    return { accessToken, refreshToken };
};
export const refreshAccessToken = (refreshToken) => {
    try {
        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Generate new access token with same payload
        const newAccessToken = jwt.sign(
            { id: decoded.id, role: decoded.role },
            process.env.JWT_SECRET,
            { expiresIn: "15m" }
        );

        return newAccessToken;
    } catch (err) {
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
