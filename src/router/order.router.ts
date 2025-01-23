import { Router } from "express";
import OrderController from "../controller/order.controller";
import isExitsShopcart from "../middleware/isExitsShopcart.middleware";
const orderRouter = Router()

orderRouter.post("/", isExitsShopcart, OrderController.createOrder)
orderRouter.get("/:user_purchase_id", OrderController.getOrder)
orderRouter.get("/details/:user_purchase_id", OrderController.getOrderDetails)


export default orderRouter