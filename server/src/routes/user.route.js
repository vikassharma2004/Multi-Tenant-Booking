import express from "express"
import { GetProfileController, LoginController, LogoutController, RefreshTokenController, RegisterController, ResetPasswordController, SendResetPasswordLinkController } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middleware/isAuthticated.js"
const AuthRouter=express.Router()



AuthRouter.route("/register").post(RegisterController)
AuthRouter.route("/login").post(LoginController)
AuthRouter.route("/getProfile").get(isAuthenticated,GetProfileController)
AuthRouter.route("/reset-password").post(SendResetPasswordLinkController);
AuthRouter.route("/reset-password/:token").post(ResetPasswordController);
AuthRouter.route("/refresh-token").get(isAuthenticated,RefreshTokenController);

AuthRouter.route("/logout").post(isAuthenticated,LogoutController);












export default AuthRouter
