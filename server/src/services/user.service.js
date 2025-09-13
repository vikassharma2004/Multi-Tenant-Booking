import { User } from "../models/User.model.js";
import { AppError } from "../middleware/ErrorHandler.js";
import { generateTokens, refreshAccessToken, setAuthCookies } from "../utils/GenerateToken.js";
import { ResetToken } from "../models/ResetToken.model.js";
import crypto from "crypto";
export const RegisterService = async (body) => {
  const { name, email, phone, username, password, UserType } = body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new AppError("Account already exists with this email or username",404);

  const user = await User.create({ email, phone, username, password });
  const {accessToken,refreshToken}=generateTokens(user._id,user.UserType);

  return { user:{
    email:user.email,
    username:user.username,
    avatar:user.avatar.url
    
  }, accessToken,refreshToken};
};

export const LoginService = async (email, password) => {
 

  const user = await User.findOne({ email, isDeleted: false });
  if (!user) throw new AppError("user not found with this email",404);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid credentials");

 const {accessToken,refreshToken}=generateTokens(user._id,user.UserType);

  

  return { user:{
    email:user.email,
    username:user.username,
    avatar:user.avatar.url,
    CreatedAt:user.createdAt
  }, accessToken,refreshToken };
};

export const GetUserProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new AppError("User not found");
  return { user };
};

export const SendResetPasswordLinkService = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new AppError("User not found");

  const token = await ResetToken.createTokenFor(user._id);
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
//   await sendEmail(user.email, "Reset Password", `Click here: ${resetLink}`);

  return { email: user.email ,resetLink};
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
    httpOnly:process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.cookie("refreshToken", "", {
    maxAge: 1,
    httpOnly:process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });

  res.status(200).json({ message: "Logout successful" });
};

export const RefreshTokenService = async (refreshToken) => {
  const newAccessToken = await refreshAccessToken(refreshToken);
  return { accessToken: newAccessToken };
};