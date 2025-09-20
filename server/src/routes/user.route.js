import express from "express"
import { GetProfileController, LoginController, LogoutController, RefreshTokenController, RegisterController, ResetPasswordController, SendOtpController, SendResetPasswordLinkController, Setup2FAController, Verify2FAController, VerifyOtpController } from "../controllers/user.controller.js"
import { isAuthenticated, isLoggedIn } from "../middleware/isAuthticated.js"
const AuthRouter=express.Router()



AuthRouter.route("/register").post(RegisterController)
AuthRouter.route("/login").post(LoginController)
AuthRouter.route("/getProfile").get(isAuthenticated,GetProfileController)
AuthRouter.route("/reset-password").post(SendResetPasswordLinkController);
AuthRouter.route("/reset-password/:token").post(ResetPasswordController);
AuthRouter.route("/refresh-token").get(isLoggedIn,RefreshTokenController);
AuthRouter.route("/send-otp").post(isAuthenticated, SendOtpController); 
AuthRouter.route("/verify-otp").post(isAuthenticated, VerifyOtpController);

AuthRouter.route("/setup-2fa").post(isAuthenticated, Setup2FAController);
AuthRouter.route("/verify-2fa").post(isAuthenticated, Verify2FAController);


AuthRouter.route("/logout").post(isLoggedIn,LogoutController);












export default AuthRouter
