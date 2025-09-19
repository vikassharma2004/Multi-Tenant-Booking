import express from "express"
import { isAuthenticated ,isLoggedIn} from "../middleware/isAuthticated.js"
import { CreateSellerApplicationController, GetAllApplicationController, GetApplicationByIdController, GetUserApplicationsController, UpdateApplicationController } from "../controllers/sellerapplication.controller.js"
const SellerApplicationRouter = express.Router()

SellerApplicationRouter.route("/").post(isLoggedIn,isAuthenticated, CreateSellerApplicationController).get(isLoggedIn,isAuthenticated, GetUserApplicationsController);
SellerApplicationRouter.route("/list").get(isLoggedIn,isAuthenticated,GetAllApplicationController)
SellerApplicationRouter.route("/manage/:id").get(isLoggedIn,isAuthenticated,GetApplicationByIdController)
SellerApplicationRouter.route("/update/:id").patch(isLoggedIn,isAuthenticated,UpdateApplicationController)

export default SellerApplicationRouter