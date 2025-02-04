import { Router } from "express";
import isCompleteUser from "@/middleware/isCompleteUser.middleware";
import isExitsShopcart from "@/middleware/isExitsShopcart.middleware";
import isGuest from "./middleware/isGuest.middleware";
import syncGuestPurchases from "./middleware/syncGuestPurchases.middleware";
import OrderController from "./order.controller";
const orderRouter = Router()

orderRouter.post("/", isCompleteUser, isExitsShopcart, OrderController.createOrder)
orderRouter.get("/:user_purchase_id", isCompleteUser, syncGuestPurchases, OrderController.getOrder)
orderRouter.post("/guest", isGuest, isExitsShopcart, OrderController.createOrderGuest)

export default orderRouter