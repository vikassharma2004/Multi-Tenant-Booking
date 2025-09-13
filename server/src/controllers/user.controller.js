import { catchAsyncError } from "../middleware/handleasyncerror.js";
import { RegisterService, LoginService, GetUserProfileService, SendResetPasswordLinkService, ResetUserPasswordService, RefreshTokenService, LogoutService } from "../services/user.service.js";
import { userValidator } from "../validators/AuthValidator.js";
import { AppError } from "../middleware/ErrorHandler.js";
import { setAuthCookies } from "../utils/GenerateToken.js";
import { ref } from "process";

//  Register
export const RegisterController = catchAsyncError(async (req, res) => {
    // ✅ validate user input
    const { error, value } = userValidator.validate(req.body || {}, { abortEarly: false });

    if (error) {
        // collect all messages and return as custom error
        const messages = error.details.map((d) => d.message);
        throw new AppError(messages.join(", "), 400);
    }
    const { user, accessToken, refreshToken } = await RegisterService(value);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json({ message: "User registered successfully", user });
});

//  Login
export const LoginController = catchAsyncError(async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) throw new AppError("Email and password are required", 400);
    const { user, accessToken, refreshToken } = await LoginService(email, password);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json({ message: "Login successful", user });
});

//  Profile
export const GetProfileController = catchAsyncError(async (req, res) => {
    const { user } = await GetUserProfileService(req.user.id);
    res.status(200).json({
        message: "User profile fetched", user: {
            id: user._id,
            avatar: { url: user.avatar?.url || "" },

            email: user.email,
            phone: user.phone,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    });
});

// ✉️ Send reset password link
export const SendResetPasswordLinkController = catchAsyncError(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw new AppError("Email is required", 400);
    }
    const { email: sendermail, resetLink } = await SendResetPasswordLinkService(email);
    res.status(200).json({ message: "Reset link sent successfully", email: sendermail, resetLink });
});

// 🔄 Reset password
export const ResetPasswordController = catchAsyncError(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    if (!token || !password) {
        throw new AppError("Token and password are required", 400);
    }
    const { message } = await ResetUserPasswordService(token, password);
    res.status(200).json({ message });
});

export const RefreshTokenController = catchAsyncError(async (req, res) => {
    const refreshtoekn=req.cookies.refreshToken
    const { accessToken } = await RefreshTokenService(refreshtoekn);
    res.status(200).json({success:true})
});
export const LogoutController = catchAsyncError(async (req, res) => {
    await LogoutService(req, res);
});