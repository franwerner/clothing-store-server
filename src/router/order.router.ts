import { Router } from "express";
import OrderController from "../controller/order.controller";
import isExitsShopcart from "../middleware/isExitsShopcart.middleware";
import isCompleteUser from "../middleware/isCompleteUser.middleware";
const orderRouter = Router()

orderRouter.post("/", isCompleteUser, isExitsShopcart, OrderController.createOrder)
orderRouter.get("/:user_purchase_id", isCompleteUser, OrderController.getOrder)
orderRouter.get("/details/:user_purchase_id", isCompleteUser, OrderController.getOrderDetails)

orderRouter.post("/guest", isExitsShopcart, OrderController.createOrder)

export default orderRouter