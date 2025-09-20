import { User } from "../models/User.model.js";
import { AppError } from "../middleware/ErrorHandler.js";
import { generateTokens, refreshAccessToken } from "../utils/GenerateToken.js";
import { ResetToken } from "../models/ResetToken.model.js";
import crypto from "crypto";
import { RolePermission } from "../models/RolePermission.model.js";
import { Otp } from "../models/Otp.model.js";
// import { sendEmail } from "../config/nodemailer.config.js";
import { templates } from "../utils/email.helper.js";
import { sendEmail } from "../config/nodemailer.config.js";
import speakeasy from "speakeasy"
import qrcode from "qrcode"

export const RegisterService = async (body) => {
  const { email, phone, username, password } = body;

  const existing = await User.findOne({ $or: [{ email }, { username }] });
  if (existing) throw new AppError("Account already exists with this email or username", 404);
  const role = await RolePermission.findOne({ role: "customer" });


  const user = await User.create({ email, phone, username, password, role: role._id });

  const { accessToken, refreshToken } = await generateTokens(user._id);

  return {
    user: {
      email: user.email,
      username: user.username,
      avatar: user.avatar.url,
      role: role.role,
      userType: user.userType,
      permissions: role.permissions,
      CreatedAt: user.createdAt

    }, accessToken, refreshToken
  };
};

export const LoginService = async (email, password) => {


  const user = await User.findOne({ email, isDeleted: false }).populate("role", "role permissions _id");
  if (!user) throw new AppError("user not found with this email", 404);

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AppError("Invalid credentials");

  const { accessToken, refreshToken } = await generateTokens(user._id);



  return {
    user: {
      email: user.email,
      username: user.username,
      avatar: user.avatar.url,
      role: user.role?.role,
      permission: user.role?.permissions,
      usertype: user.userType,
      CreatedAt: user.createdAt
    }, accessToken, refreshToken
  };
};

export const GetUserProfileService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new AppError("User not found");

  if (user.userType != "customer") {
    return { user };
  }
  else {
    return {
      user: {
        id: user._id,
        avatar: { url: user.avatar?.url, public_id: user.avatar?.public_id },
        isEmailVerified: user.isEmailVerified,
        twoFA: {
          enabled: user.twoFA.enabled,
          method: user.twoFA.method
        },
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
export const sendOtp = async (email, purpose) => {
  // ✅ generate OTP using Otp mode
  const otp = await Otp.generateOtpFor(email, purpose);

  // ✅ send OTP via email (or SMS)
  const user = await User.findOne({ email });

  // Queue email instead of sending directly
  await sendEmail({
    to: email,
    subject: `Your OTP for ${purpose}`,
    html: templates.otp(otp, user?.username || "User", purpose),
    text: `Your OTP for ${purpose} is: ${otp}`,
  });
  return otp;
};
export const verifyOtp = async (email, purpose, enteredOtp) => {
  const user = await User.findOne({ email });

  const isValid = await Otp.verifyOtp(email, purpose, enteredOtp);
  if (isValid) {
    user.isEmailVerified = true;
    await user.save();
  }
  return isValid;
};
export const setup2FAService = async (userId) => {
  const user = await User.findById(userId);
  const secret = speakeasy.generateSecret({ length: 20, name: `Bookverse (${user.email})` });

  await User.findByIdAndUpdate(userId, { 'twoFA.secret': secret.base32, 'twoFA.enabled': false });


  // Generate QR code URL to show in frontend
  const otpauthUrl = await qrcode.toDataURL(secret.otpauth_url);

  return { otpauthUrl, base32: secret.base32 };
};

export const verify2FAService = async (userId, token) => {
  console.log("verify2FAService");
  console.log("userId", userId);
  console.log("token", token);
  const user = await User.findById(userId);
  if (!user || !user.twoFASecret) return false;

  console.log("token", token);
  const verified = speakeasy.totp.verify({
    secret: user.twoFA.secret,
    encoding: "base32",
    token,
    window: 1
  });

  // If verified, enable 2FA in user profile
  if (verified && !user.is2FAEnabled) {
    user.is2FAEnabled = true;
    await user.save();
  }

  return verified;
};