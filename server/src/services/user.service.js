import { User } from "../models/User.model.js";
import { AppError } from "../middleware/ErrorHandler.js";
import { generateTokens, refreshAccessToken, setAuthCookies } from "../utils/GenerateToken.js";
import { ResetToken } from "../models/ResetToken.model.js";
import crypto from "crypto";
import { RolePermission } from "../models/RolePermission.model.js";
export const RegisterService = async (body) => {
  const {  email, phone, username, password } = body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new AppError("Account already exists with this email or username", 404);
  const role=await RolePermission.findOne({ role: "customer" });

  
  const user = await User.create({ email, phone, username, password,role:role._id });

  const { accessToken, refreshToken } = generateTokens(user._id, user.userType, role._id,role.permissions);

  return {
    user: {
      email: user.email,
      username: user.username,
      avatar: user.avatar.url,
      role:role.role,
      userType:user.userType,
      permissions:role.permissions,
      CreatedAt: user.createdAt

    }, accessToken, refreshToken
  };
};

export const LoginService = async (email, password) => {


  const user = await User.findOne({ email, isDeleted: false }).populate("role","role permissions _id");
  if (!user) throw new AppError("user not found with this email", 404);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid credentials");

  const { accessToken, refreshToken } = generateTokens(user._id, user.userType,user.role?.role,user.role?.permissions);



  return {
    user: {
      email: user.email,
      username: user.username,
      avatar: user.avatar.url,
      role:user.role?.role,
      permission:user.role?.permissions,
      usertype:user.userType,
      CreatedAt: user.createdAt
    }, accessToken, refreshToken
  };
};

export const GetUserProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new AppError("User not found");

  if (user.UserType != "customer") {
    return { user };
  }
  else {
    return {
      user: {
        id: user._id,
        avatar: { url: user.avatar?.url || "" },

        email: user.email,
        phone: user.phone,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  }

};

export const SendResetPasswordLinkService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found");

  const token = await ResetToken.createTokenFor(user._id);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  //   await sendEmail(user.email, "Reset Password", `Click here: ${resetLink}`);

  return { email: user.email, resetLink };
};

export const ResetUserPasswordService = async (token, newPassword) => {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");


  const tokenDoc = await ResetToken.findOne({ tokenHash, used: false });
  if (!tokenDoc) throw new AppError("Invalid or expired token", 400);


  const verifiedToken = await ResetToken.verifyToken(tokenDoc.user, token);
  if (!verifiedToken) throw new AppError("Invalid or expired token", 400);


  await tokenDoc.markUsed();


  const user = await User.findById(tokenDoc.user);
  if (!user) throw new AppError("User not found", 404);


  user.password = newPassword;
  await user.save();


  await tokenDoc.deleteOne();

  return { message: "Password reset successful" };
};

export const LogoutService = async (req, res) => {
  // Clear both access and refresh tokens
  res.cookie("accessToken", "", {
    maxAge: 1,
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.cookie("refreshToken", "", {
    maxAge: 1,
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({ message: "Logout successful" });
};

export const RefreshTokenService = async (refreshToken) => {
  const newAccessToken = await refreshAccessToken(refreshToken);
  return { accessToken: newAccessToken };
};