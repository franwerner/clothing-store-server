import { Router } from "express";
import OrderController from "../controller/order.controller";
const orderRouter = Router()

orderRouter.post("/",OrderController.createOrder)
orderRouter.get("/",OrderController.getOrder)
orderRouter.get("/details",OrderController.getOrderDetails)


export default orderRouter