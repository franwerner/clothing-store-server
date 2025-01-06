import { Router } from "express";
import OrderController from "../controller/order.controller";
import isExitsShopcart from "../middleware/isExitsShopcart.middleware";
const orderRouter = Router()

orderRouter.post("/",isExitsShopcart,OrderController.createOrder)
orderRouter.get("/",OrderController.getOrder)
orderRouter.get("/details",OrderController.getOrderDetails)


export default orderRouter