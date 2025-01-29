import { Router } from "express";
import OrderController from "@/controller/order.controller";
import isCompleteUser from "@/middleware/isCompleteUser.middleware";
import isExitsShopcart from "@/middleware/isExitsShopcart.middleware";
import isGuest from "./middleware/isGuest.middleware";
const orderRouter = Router()

orderRouter.post("/", isCompleteUser, isExitsShopcart, OrderController.createOrder)
orderRouter.get("/:user_purchase_id", isCompleteUser, OrderController.getOrder)
orderRouter.post("/guest",isGuest, isExitsShopcart, OrderController.createOrderGuest)

export default orderRouter