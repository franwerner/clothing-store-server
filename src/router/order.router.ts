import {Router} from "express";
import OrderController from "../controller/order.controller";
import isCompleteUser from "../middleware/isCompleteUser.middleware";
const orderRouter = Router()

orderRouter.post("/create",isCompleteUser,OrderController.createOrder)

export default orderRouter