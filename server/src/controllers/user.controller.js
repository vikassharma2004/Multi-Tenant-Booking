import { catchAsyncError } from "../middleware/handleasyncerror.js";
import { RegisterService, LoginService, GetUserProfileService, SendResetPasswordLinkService, ResetUserPasswordService, RefreshTokenService, LogoutService, sendOtp, verifyOtp, setup2FAService, verify2FAService } from "../services/user.service.js";
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
    console.log(user, accessToken, refreshToken);
    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json({ message: "Login successful", user });
});

//  Profile
export const GetProfileController = catchAsyncError(async (req, res) => {
    const { user } = await GetUserProfileService(req.user.id);
    res.status(200).json({
        message: "User profile fetched", user
    });
});

// ✉️ Send reset password link
export const SendResetPasswordLinkController = catchAsyncError(async (req, res) => {
    const { email } = req.body || {};
    if (!email || req.body == "undefined") {
        throw new AppError("Email is required", 400);
    }
    const { email: sendermail, resetLink } = await SendResetPasswordLinkService(email);
    res.status(200).json({ message: "Reset link sent successfully", email: sendermail, resetLink });
});

// 🔄 Reset password
export const ResetPasswordController = catchAsyncError(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body || {};
    if (!token || !password || req.body == "undefined") {
        throw new AppError("Token and password are required", 400);
    }
    const { message } = await ResetUserPasswordService(token, password);
    res.status(200).json({ message });
});

export const RefreshTokenController = catchAsyncError(async (req, res) => {
    const refreshtoekn = req.cookies.refreshToken
    const { accessToken } = await RefreshTokenService(refreshtoekn);
    await setAuthCookies(res, accessToken, refreshtoekn);
    res.status(200).json({ success: true })
});
export const LogoutController = catchAsyncError(async (req, res) => {
    await LogoutService(req, res);
});
export const SendOtpController = catchAsyncError(async (req, res) => {
    const { purpose, email } = req.body;
    if (!email || !purpose) throw new AppError("Email is required", 400);

    // ✅ call service
    await sendOtp(email, purpose);

    res.status(200).json({
        success: true,
        message: "OTP sent successfully",
        // otp: otp // only include for dev/testing
    });
});
export const VerifyOtpController = catchAsyncError(async (req, res) => {
    const { otp, purpose, email } = req.body;

    if (!otp || !purpose) throw new AppError("OTP is required", 400);
    const isValid = await verifyOtp(email, purpose, otp);

    if (!isValid) {
        return res.status(400).json({
            success: false,
            message: "Invalid or expired OTP",
        });
    }

    res.status(200).json({ success: true, message: "OTP verified successfully" });
});
export const Setup2FAController = catchAsyncError(async (req, res) => {
    const userId = req.user._id;

    // Generate secret and QR code URL
    const { otpauthUrl, base32 } = await setup2FAService(userId);

    res.status(200).json({
        success: true,
        message: "2FA setup initiated",
        otpauthUrl
    });
});

export const Verify2FAController = catchAsyncError(async (req, res) => {
    const userId = req.user._id;
    const { token } = req.body;

    if (!token) throw new AppError("Token is required", 400);

    const verified = await verify2FAService(userId, token);

    if (!verified) throw new AppError("Invalid 2FA token", 400);

    res.status(200).json({
        success: true,
        message: "2FA verified successfully",
    });
});