import express from "express"
import { isAuthenticated } from "../middleware/isAuthticated.js"
import { CreateSellerApplicationController, GetAllApplicationController, GetApplicationByIdController, GetUserApplicationsController, UpdateApplicationController } from "../controllers/sellerapplication.controller.js"
const SellerApplicationRouter = express.Router()

SellerApplicationRouter.route("/").post(isAuthenticated, CreateSellerApplicationController).get(isAuthenticated, GetUserApplicationsController);
SellerApplicationRouter.route("/list").get(isAuthenticated,GetAllApplicationController)
SellerApplicationRouter.route("/manage/:id").get(isAuthenticated,GetApplicationByIdController).patch(isAuthenticated,UpdateApplicationController)

export default SellerApplicationRouter