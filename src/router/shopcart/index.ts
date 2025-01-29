import { Router } from "express"
import ShopcartController from "@/controller/shopcart.controller"
import isExitsShopcart from "@/middleware/isExitsShopcart.middleware"
import createShopcartMiddleware from "./middleware/createShopcart.middleware"

const shopcartRouter = Router()

shopcartRouter.get("/", isExitsShopcart, ShopcartController.getShopcart)
shopcartRouter.post("/", createShopcartMiddleware, ShopcartController.addProducts)
shopcartRouter.delete("/", isExitsShopcart, ShopcartController.removeProduct)
shopcartRouter.patch("/", isExitsShopcart, ShopcartController.updateProductQuantity)

export default shopcartRouter